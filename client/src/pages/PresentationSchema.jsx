import { useState, useRef, useEffect } from "react";
import ActionButton from "../components/button/ActionButton";
import { useAlert } from "../context/Alert";
import Loading from "../components/Loading/Loading";
import useFetchEvents from "../hooks/useFetchEvents";
import { useFetchUsers } from "../hooks/useFetchUsers";
import { useLocalStorage } from "@uidotdev/usehooks";
import { downloadPDF } from "../helpers/downloadPdf.js";
import { InputContainer } from "../styles/formStyles.jsx";
import { Article, Section } from "../styles/containerStyles.jsx";
import { List, ListItem } from "../styles/listStyles.jsx";
import { ButtonContainer } from "../styles/buttonStyles.jsx";

const PresentationSchema = ({ event }) => {
  const [newStudent, setNewStudent] = useState("");
  const pdfRef = useRef();
  const [schedule, setSchedule] = useState([]);
  const [fileUrl, setFileUrl] = useState("");
  const dayNames = {
    1: "Mandag",
    2: "Tirsdag",
    3: "Onsdag",
    4: "Torsdag",
    5: "Fredag",
  };

  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess } = useAlert();
  const [selectedDay, setSelectedDay] = useState(null);
  const [planGenerated, setPlanGenerated] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const { updateEvent } = useFetchEvents();
  const [remainingStudents, setRemainingStudents] = useLocalStorage(
    "remainingStudents",
    []
  );

  const { users, isLoading: isLoadingUsers } = useFetchUsers();
  const [students, setStudents] = useState(remainingStudents);
  const studentsInitialized = useRef(false);

  // Hent eleverne fra databasen (kun første gang der kommer brugere ind)
  useEffect(() => {
    if (studentsInitialized.current || users.length === 0) return;
    studentsInitialized.current = true;

    const studentNames = users
      .filter((user) => user.role === "student")
      .map((user) => user.name)
      .sort((a, b) => a.localeCompare(b, "da"));

    // Fjern gamle elever fra localStorage, som ikke længere findes i databasen
    const savedStudents = remainingStudents.filter((student) =>
      studentNames.includes(student)
    );
    setRemainingStudents(savedStudents);

    // Har vi gemte elever fra en tidligere plan, bruger vi dem
    setStudents(savedStudents.length > 0 ? savedStudents : studentNames);
  }, [users, remainingStudents, setRemainingStudents]);

  // Inddel i grupper
  const [groups, setGroups] = useState([]);

  const divideIntoGroups = () => {
    if (students.length === 0) return;

    const shuffledStudents = [...students].sort(() => Math.random() - 0.5);
    const groupSize = 3;
    const newGroups = [];

    for (let i = 0; i < shuffledStudents.length; i += groupSize) {
      newGroups.push(shuffledStudents.slice(i, i + groupSize));
    }

    setGroups(newGroups);
  };

  useEffect(() => {
    if (isDownloadingPDF && pdfRef.current) {
      setTimeout(
        () =>
          downloadPDF({
            pdfRef,
            updateEvent,
            fileUrl,
            setFileUrl,
            showSuccess,
            isLoading,
            setIsLoading,
            event,
          }),
        300
      );
    }
  }, [isDownloadingPDF]);

  useEffect(() => {
    if (event?.date) {
      const eventDay = new Date(event.date).getDay();

      const weekdayMapping = {
        1: 1, // Mandag → 1
        2: 2, // Tirsdag → 2
        3: 3, // Onsdag → 3
        4: 4, // Torsdag → 4
        5: 5, // Fredag → 5
        6: 1, // Lørdag → Sæt til Mandag
        0: 1, // Søndag → Sæt til Mandag
      };

      const correctedDay = weekdayMapping[eventDay];
      setSelectedDay(correctedDay);
    }
  }, [event]);

  const getWeekdayName = (dayIndex) => {
    const weekdays = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag"];
    return weekdays[dayIndex];
  };

  const addStudent = () => {
    if (newStudent.trim() !== "" && !students.includes(newStudent)) {
      setStudents([...students, newStudent]);
      setNewStudent("");
    }
  };

  const removeStudent = (name) => {
    setStudents(students.filter((student) => student !== name));
  };

  const handleButtonClicked = () => {
    const eventDay = new Date(event.date).getDay();
    const weekdayMapping = {
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 1, // Lørdag → Mandag
      0: 1, // Søndag → Mandag
    };

    const correctedDay = weekdayMapping[eventDay];

    setSelectedDay(correctedDay);
    setRemainingStudents([]);
    localStorage.removeItem("remainingStudents");
    generateSchedule();
    setPlanGenerated(true);
  };

  const generateSchedule = () => {
    const shuffledStudents = [...students].sort(() => Math.random() - 0.5);

    const startTime = 9;
    const endTime = 13;
    const duration = 0.5; // 30 min
    const timeSlots = [];
    let currentTime = startTime;

    while (currentTime < endTime) {
      const hours = Math.floor(currentTime);
      const minutes = (currentTime % 1) * 60;

      // (Bevar evt. din eksisterende speciallogik her, hvis ønsket)
      // Fx hvis du VIL springe 11:30 over:
      // if (hours === 11 && minutes === 30) {
      //   currentTime = 12;
      //   continue;
      // }

      const time = `${hours}:${minutes === 0 ? "00" : "30"}`;
      timeSlots.push(time);
      currentTime += duration;
    }

    const assignTimeSlots = (list, day) =>
      list.map((student, index) => ({
        name: student,
        time: timeSlots[index] || "Ingen tid tilbage",
        day,
      }));

    const eventDay = new Date(event.date).getDay();
    const dayNamesLocal = [
      "Søndag",
      "Mandag",
      "Tirsdag",
      "Onsdag",
      "Torsdag",
      "Fredag",
      "Lørdag",
    ];
    const eventWeekdayName = dayNamesLocal[eventDay] || "Mandag";

    // Map til dine dag-navne (Mandag=1 ... Fredag=5)
    const matchingDay =
      parseInt(
        Object.keys(dayNames).find((key) => dayNames[key] === eventWeekdayName)
      ) || 1;

    const firstDay = matchingDay;
    const secondDay = firstDay + 1 > 5 ? 1 : firstDay + 1;

    let newSchedule = [];

    if (shuffledStudents.length <= timeSlots.length) {
      // Alle kan på dag 1
      newSchedule = [...assignTimeSlots(shuffledStudents, firstDay)];
    } else {
      // Fyld dag 1, resten på dag 2
      const day1Students = shuffledStudents.slice(0, timeSlots.length);
      const day2Students = shuffledStudents.slice(timeSlots.length);

      newSchedule = [
        ...assignTimeSlots(day1Students, firstDay),
        ...assignTimeSlots(day2Students, secondDay),
      ];
    }

    // 🔹 Indsæt PAUSE 10:00–10:30 på dag 1 (vist lige før 10:30-slotten)
    const insertAt = timeSlots.indexOf("10:30");
    if (insertAt !== -1) {
      newSchedule.splice(insertAt, 0, {
        isBreak: true,
        time: "10:00–10:30",
        day: firstDay,
      });
    }

    setSchedule(newSchedule);

    // 🔹 Overskydende elever (ignorer pause)
    const studentsOnEventDay = newSchedule
      .filter((item) => item.day == matchingDay && !item.isBreak)
      .map((item) => item.name);

    const uniqueRemainingStudents = [
      ...new Set(
        students.filter((student) => !studentsOnEventDay.includes(student))
      ),
    ];

    setRemainingStudents(uniqueRemainingStudents);
  };

  const handleNewPlan = () => {
    setRemainingStudents([]);
    localStorage.removeItem("remainingStudents");
    setSchedule([]);
  };

  if (isLoading || isLoadingUsers) {
    return <Loading />;
  }

  return (
    <Article>
      {!planGenerated ? (
        <>
          <h3>Tilføj elever</h3>
          <List>
            {students.map((student, index) => (
              <ListItem key={index}>
                {student}{" "}
                <ActionButton
                  onClick={() => removeStudent(student)}
                  actionType='delete'
                  background='red'
                />
              </ListItem>
            ))}
            <ListItem>
              <InputContainer>
                <input
                  type='text'
                  value={newStudent}
                  onChange={(e) => setNewStudent(e.target.value)}
                  placeholder='Tilføj elevens navn'
                />
                <ActionButton
                  onClick={addStudent}
                  actionType='add'
                  background='green'
                />
              </InputContainer>
            </ListItem>
          </List>
          <ActionButton
            onClick={divideIntoGroups}
            buttonText='👥 Opdel i grupper'
          />
          <ActionButton
            onClick={handleButtonClicked}
            buttonText='📅 Lav fremlæggelsesplan'
          />
        </>
      ) : (
        <>
          {schedule.length > 0 ? (
            <>
              {/* 🔹 UI-visning af planen */}
              <Section>
                <h3>Fremlæggelsesplan</h3>
                <h4>{dayNames[selectedDay]}</h4>
                <List>
                  {schedule
                    .filter((item) => !remainingStudents.includes(item.name))
                    .map((item, index) => (
                      <ListItem
                        key={index}
                        style={{ margin: "10px 0", listStyle: "none" }}>
                        Kl. {item.time} - {item.name}
                      </ListItem>
                    ))}
                </List>
                <ButtonContainer>
                  <ActionButton
                    onClick={handleNewPlan}
                    buttonText='📅 Lav ny fremlæggelsesplan'
                  />
                  <ActionButton
                    onClick={() => setIsDownloadingPDF(true)}
                    buttonText='📥 Upload plan'
                  />
                </ButtonContainer>
              </Section>

              {/* 🔹 Skjult div til PDF (uden overskydende elever) */}
              <Section
                ref={pdfRef}
                style={{
                  position: "absolute",
                  top: "-10000px",
                  left: "-10000px",
                  width: "100%",
                  padding: "20px",
                  backgroundColor: "#fff",
                  fontFamily: "Arial, sans-serif",
                }}>
                <h3>Fremlæggelsesplan - {dayNames[selectedDay]}</h3>
                <List>
                  {schedule
                    .filter((item) => !remainingStudents.includes(item.name))
                    .map((item, index) => (
                      <ListItem
                        key={index}
                        style={{ margin: "10px 0", listStyle: "none" }}>
                        Kl. {item.time} - {item.name}
                      </ListItem>
                    ))}
                </List>
              </Section>

              {/* 🔹 Overskydende elever vises KUN i UI */}
              <Section>
                <h3>Overskydende elever</h3>
                <List>
                  {remainingStudents.map((student, index) => (
                    <ListItem key={index}>{student}</ListItem>
                  ))}
                </List>
              </Section>
            </>
          ) : (
            <>
              <p>Ingen plan endnu. Klik på knappen for at generere!</p>
              <ActionButton
                onClick={handleButtonClicked}
                buttonText='📅 Lav fremlæggelsesplan'
              />
            </>
          )}
        </>
      )}

      {groups.length > 0 && (
        <Section>
          <h3>Grupper</h3>
          {groups.map((group, index) => (
            <div key={index}>
              <h4>Gruppe {index + 1}</h4>
              <List>
                {group.map((student, i) => (
                  <ListItem key={i}>{student}</ListItem>
                ))}
              </List>
            </div>
          ))}
        </Section>
      )}
    </Article>
  );
};

export default PresentationSchema;

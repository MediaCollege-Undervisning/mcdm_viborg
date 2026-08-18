import { useState, useEffect, useRef } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useAlert } from "../context/Alert";
import useFetchEvents from "../hooks/useFetchEvents";
import { downloadPDF } from "../helpers/downloadPdf.js";
import { Section } from "../styles/containerStyles";
import { List, ListItem } from "../styles/listStyles";
import ActionButton from "../components/button/ActionButton";
import { InputContainer } from "../styles/formStyles";
import { ButtonContainer } from "../styles/buttonStyles";
import { formatDateWithDay } from "../helpers/formatDate.js";
import Loading from "../components/Loading/Loading.jsx";
import { useFetchUsers } from "../hooks/useFetchUsers.jsx";

const ExamSchedule = ({ event, setShowSchema }) => {
  const [newStudent, setNewStudent] = useState("");
  const { users, isLoading: isLoadingUsers } = useFetchUsers();
  const [students, setStudents] = useState([]);
  const studentsInitialized = useRef(false);
  const [schedule, setSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [planGenerated, setPlanGenerated] = useState(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  // const [selectedDays, setSelectedDays] = useState([]); // Valgte eksamensdage
  // const [selectedDayForPDF, setSelectedDayForPDF] = useState(""); // Dag til PDF
  const [remainingStudents, setRemainingStudents] = useLocalStorage(
    "remainingStudents",
    []
  );
  const pdfRef = useRef();
  const { showSuccess } = useAlert();
  const { updateEvent } = useFetchEvents();

  // Hent eleverne fra databasen (kun første gang der kommer brugere ind)
  useEffect(() => {
    if (studentsInitialized.current || users.length === 0) return;
    studentsInitialized.current = true;

    const studentNames = users
      .filter((user) => user.role === "student")
      .map((user) => user.name)
      .sort((a, b) => a.localeCompare(b, "da"));

    setStudents(studentNames);

    // Fjern gamle elever fra localStorage, som ikke længere findes i databasen
    setRemainingStudents((prev) =>
      prev.filter((student) => studentNames.includes(student))
    );
  }, [users, setRemainingStudents]);

  const handleDownloadPDF = () => {
    if (schedule.length === 0) {
      alert("Der er ingen eksamensplan at downloade!");
      return;
    }

    setIsDownloadingPDF(true);
  };

  useEffect(() => {
    if (isDownloadingPDF && pdfRef.current) {
      (async () => {
        const success = await downloadPDF({
          pdfRef,
          updateEvent,
          setFileUrl,
          fileUrl,
          showSuccess,
          isLoading,
          setIsLoading,
          event,
        });

        if (success) {
          setTimeout(() => {
            setShowSchema?.(false);
          }, 100);
        }
      })();
    }
  }, [isDownloadingPDF]);

  const addStudent = () => {
    if (newStudent.trim() !== "" && !students.includes(newStudent)) {
      setStudents([...students, newStudent]);
      setNewStudent("");
    }
  };

  const removeStudent = (name) => {
    setStudents(students.filter((student) => student !== name));
  };

  // Uden et event (fx via /backoffice/examSchedule) bruger vi dagens dato
  const examDay = formatDateWithDay(event?.date ?? new Date());

  const generateSchedule = () => {
    const activeStudents =
      remainingStudents.length > 0 ? remainingStudents : students;
    const shuffledStudents = [...activeStudents].sort(
      () => Math.random() - 0.5
    );

    // Tider fra kl. 9 til 16 – frokostpausen kl. 12 springes over
    const timeSlots = [];
    for (let hour = 9; hour < 16; hour++) {
      if (hour === 12) continue;
      timeSlots.push(`${hour}:00`);
    }

    // Fordel eleverne ligeligt: 10 elever der ikke kan nås på én dag
    // bliver til 5 i dag og 5 til næste eksamensdag
    const numberOfDays = Math.max(
      1,
      Math.ceil(shuffledStudents.length / timeSlots.length)
    );
    const studentsPerDay = Math.ceil(shuffledStudents.length / numberOfDays);

    const currentSchedule = shuffledStudents
      .slice(0, studentsPerDay)
      .map((student, index) => ({
        name: student,
        day: examDay,
        time: timeSlots[index],
      }));

    const remaining = shuffledStudents.slice(studentsPerDay);

    setSchedule(currentSchedule);
    setRemainingStudents(remaining); // Opdater remaining students
    setPlanGenerated(true);
  };

  const resetSchedule = () => {
    setSchedule([]);
    setPlanGenerated(false);
    setRemainingStudents([]);
  };

  if (isLoading || isLoadingUsers) {
    return <Loading />;
  }

  return (
    <Section>
      <h3>Tilføj elever</h3>
      <List>
        {(remainingStudents.length > 0 ? remainingStudents : students).map(
          (student, index) => (
            <ListItem key={index}>
              {student}{" "}
              <ActionButton
                onClick={() => removeStudent(student)}
                buttonText='Fjern'
                background='red'
              />
            </ListItem>
          )
        )}
      </List>

      <InputContainer>
        <input
          type='text'
          value={newStudent}
          onChange={(e) => setNewStudent(e.target.value)}
          placeholder='Tilføj elev'
        />
        <ActionButton
          onClick={addStudent}
          buttonText='Tilføj'
          background='green'
        />
      </InputContainer>

      <ActionButton
        onClick={generateSchedule}
        buttonText='Generer eksamensplan'
        background='green'
      />

      {planGenerated && (
        <>
          <Section>
            <header>
              <h1>Eksamensplan</h1>
            </header>

            {Object.entries(
              schedule.reduce((acc, item) => {
                if (!acc[item.day]) acc[item.day] = [];
                acc[item.day].push(item);
                return acc;
              }, {})
            ).map(([day, students]) => (
              <div key={day}>
                <h3>{day}</h3>
                <List>
                  {students.map((student, index) => (
                    <ListItem key={index}>
                      Kl. {student.time} - {student.name}
                    </ListItem>
                  ))}
                </List>
              </div>
            ))}

            <ButtonContainer>
              <ActionButton onClick={resetSchedule} buttonText='Nulstil plan' />
              {event && (
                <ActionButton
                  onClick={handleDownloadPDF}
                  buttonText='Upload PDF'
                  background='green'
                />
              )}
            </ButtonContainer>
          </Section>

          {/* Skjult PDF-generering kun for første dag */}
          <Section
            ref={pdfRef}
            style={{
              position: "absolute",
              left: "-9999px",
              top: "-9999px",
              width: "100%",
              backgroundColor: "#fff",
              fontSize: "10px",
              fontFamily: "Arial, sans-serif",
            }}>
            <h3 style={{ fontSize: "15px" }}>Eksamensplan</h3>
            {schedule.length > 0 && (
              <div>
                <h3 style={{ fontSize: "10px" }}>{examDay}</h3>
                <List>
                  {schedule.map((student, index) => (
                    <ListItem style={{ fontSize: "8px" }} key={index}>
                      Kl. {student.time} - {student.name}
                    </ListItem>
                  ))}
                </List>
              </div>
            )}
          </Section>
        </>
      )}
    </Section>
  );
};

export default ExamSchedule;

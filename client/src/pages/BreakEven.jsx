import { useState } from "react";
import styles from "../components/forms/form.module.css";
import { Button } from "../components/Form";
import { useAlert } from "../context/Alert";
import Loading from "../components/Loading/Loading";
import styled from "styled-components";

export const BreakEven = () => {
  const [pricePerItem, setPricePerItem] = useState("");
  const [costPerItem, setCostPerItem] = useState("");
  const [fixedCost, setFixedCost] = useState("");
  const [targetProfit, setTargetProfit] = useState(
    "Mål (DKK): 0 = break-even, >0 overskud, <0 underskud"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const { showSuccess, showError } = useAlert?.() ?? {
    showSuccess: () => {},
    showError: () => {},
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      // Konverter strengen til et komma-tal (float)
      const price = parseFloat(pricePerItem);
      const variable = parseFloat(costPerItem);
      const fixed = parseFloat(fixedCost);
      const target = parseFloat(targetProfit || "0");

      // Tjek om alle inputs er gyldige tal efter konvertering
      if (![price, variable, fixed, target].every((v) => Number.isFinite(v))) {
        showError?.("Udfyld alle felter med gyldige tal.");
        return;
      }

      // Kun mål/ønske må være negativt
      if (price < 0 || variable < 0 || fixed < 0) {
        showError?.(
          "Tal kan ikke være negative (på nær mål, som gerne må være negativt)."
        );
        return;
      }

      // Omkostning minus pris
      const contribution = price - variable;
      if (contribution <= 0) {
        showError?.(
          "Salgspris skal være højere end variable omkostninger pr. enhed."
        );
        return;
      }

      // Antal varer: Fast omkostning plus mål/ønske divideret med contribution
      const rawUnits = (fixed + target) / contribution;
      // Afrundet antal varer
      const units = Math.max(0, Math.ceil(rawUnits));
      // Pris på samlet antal varer
      const revenue = units * price;
      // Resultat (overskud, underskud, break even)
      const profit = units * contribution - fixed;

      setResult({ units, revenue, profit, contribution });
      const prettyTarget =
        target === 0
          ? "at gå i nul"
          : target > 0
          ? `et overskud på ${target.toLocaleString("da-DK", {
              style: "currency",
              currency: "DKK",
            })}`
          : `et underskud på ${Math.abs(target).toLocaleString("da-DK", {
              style: "currency",
              currency: "DKK",
            })}`;
      showSuccess?.(
        `Du skal mindst sælge ${units.toLocaleString(
          "da-DK"
        )} enheder for ${prettyTarget}.`
      );
    } catch (e) {
      console.error(e);
      showError?.("Der opstod en fejl under beregningen.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <StyledContainer>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h4>Break-even / overskud / underskud</h4>

        <div>
          <label>Salgspris pr. enhed</label>
          <input
            id='pricePerItem'
            type='number'
            inputMode='decimal'
            step='0.01'
            min='0'
            value={pricePerItem}
            onChange={(e) => setPricePerItem(e.target.value)}
            placeholder='Salgspris pr. enhed'
            required
          />
        </div>

        <div>
          <label>Variable omkostninger pr. enhed</label>
          <input
            id='costPerItem'
            type='number'
            inputMode='decimal'
            step='0.01'
            min='0'
            value={costPerItem}
            onChange={(e) => setCostPerItem(e.target.value)}
            placeholder='Variable omkostninger pr. enhed'
            required
          />
        </div>

        <div>
          <label>Faste omkostninger (i alt)</label>
          <input
            id='fixedCost'
            type='number'
            inputMode='decimal'
            step='0.01'
            min='0'
            value={fixedCost}
            onChange={(e) => setFixedCost(e.target.value)}
            placeholder='Faste omkostninger (i alt)'
            required
          />
        </div>

        <div>
          <label>Mål/ønske (DKK)</label>
          <input
            id='targetProfit'
            type='number'
            inputMode='decimal'
            step='0.01'
            value={targetProfit}
            onChange={(e) => setTargetProfit(e.target.value)}
            placeholder='Mål (DKK): 0 = break-even, >0 overskud, <0 underskud'
          />
        </div>

        <Button type='submit'>Udregn</Button>
      </form>

      {result && (
        <ResultBox>
          <p>
            <strong>Nødvendige enheder:</strong>{" "}
            {result.units.toLocaleString("da-DK")}
          </p>
          <p>
            <strong>Nødvendig omsætning:</strong>{" "}
            {result.revenue.toLocaleString("da-DK", {
              style: "currency",
              currency: "DKK",
            })}
          </p>
          <p>
            <strong>Forventet resultat ved {result.units} enheder:</strong>{" "}
            {result.profit.toLocaleString("da-DK", {
              style: "currency",
              currency: "DKK",
            })}
          </p>
          <small>
            Formel: enheder = ⌈(faste omkostninger + mål) / (pris − variable
            omkostninger)⌉.
          </small>
        </ResultBox>
      )}
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  width: 50%;
  margin: 0 auto;

  h4 {
    margin-bottom: 10px;
    font-size: 20px;
  }
  @media (max-width: 768px) {
    width: 100%;
    padding: 0 12px;
  }

  div {
    display: flex;
    flex-direction: column;
    text-align: left;
    background-color: #85858531;
    padding: 10px;
  }
`;

const ResultBox = styled.div`
  margin-top: 16px;
  padding: 12px;
  border-radius: 8px;
  background: #f6f7f9;
`;

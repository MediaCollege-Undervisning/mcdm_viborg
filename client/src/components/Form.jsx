import { useState } from "react";
import styled from "styled-components";

const Form = ({ onLogin }) => {
  const [inputPassword, setInputPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(inputPassword);
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <Title>🔒 Adgangskode påkrævet</Title>
      <Input
        type='password'
        value={inputPassword}
        onChange={(e) => setInputPassword(e.target.value)}
        placeholder='Indtast adgangskode'
      />
      <Button type='submit'>Log ind</Button>
    </FormContainer>
  );
};

export default Form;

// 🎨 Styled Components
export const FormContainer = styled.form`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  text-align: center;
  max-width: 400px;
  margin: 2rem auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Title = styled.h2`
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

export const Input = styled.input`
  padding: 0.8rem;
  font-size: 1rem;
  border: 2px solid #ddd;
  border-radius: 5px;
  transition: all 0.3s ease-in-out;
  width: 100%;

  &:focus {
    border-color: #4ca1af;
    outline: none;
    box-shadow: 0px 0px 5px rgba(76, 161, 175, 0.5);
  }
`;

export const Button = styled.button`
  background: #4ca1af;
  color: white;
  padding: 0.8rem;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease-in-out;

  &:hover {
    background: #357a7f;
  }
`;

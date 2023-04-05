/*
Construa um formulário de criação/cadastro de usuário com validação de campos utilizando apenas duas bibliotecas: yup + react-input-mask,
Os campos deverão ser:

- Nome
- E-mail
- Telefone
- Senha
- Confirmar senha

Ao finalizar o cadastro e disparar o submit, deverá exibir na tela uma mensagem de confirmação.

*/

import InputMask from "react-input-mask";
import React, { useState } from "react";
import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().required("Nome é obrigatório"),
  email: yup.string().email().required("E-mail é obrigatório"),
  phone: yup.string().required("Telefone é obrigatório"),
  password: yup.string().required("Senha é obrigatória"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Senhas não conferem")
    .required("Confirmação de senha é obrigatória"),
});

type InputProps = {
  value?: string;
  onChange?: (event: React.FormEvent<HTMLInputElement>) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

const Input = (props: InputProps) => {
  const [value, setValue] = useState(props.value || "");

  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setValue(value);
    props.onChange && props.onChange(event);
  };

  return <input {...props} value={value} onChange={onChange} />;
};

// seria muito mais facil com uma lib de formularios
export const App = () => {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // query select all inputs
    const inputs = Array.from(e.currentTarget.querySelectorAll("input"));

    // get values
    const values = inputs.reduce((acc, input) => {
      const { id, value } = input;
      return { ...acc, [id]: value };
    }, {});

    // validate
    schema
      .validate(values, { abortEarly: false })
      .then((values) => {
        alert(
          `Cadastro realizado com sucesso! \n\nNome: ${values.name} \nE-mail: ${values.email} \nTelefone: ${values.phone}`
        );
        console.debug("values", values);
      })
      .catch((err) => {
        alert(err.errors.join("\n"));
      });
  };

  return (
    <div>
      <h1>Formulário de cadastro</h1>
      <form onSubmit={onSubmit}>
        {/* Name */}
        <div>
          <label htmlFor="name">Nome</label>
          <Input type="text" id="name" />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email">E-mail</label>
          <Input type="email" id="email" />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone">Telefone</label>
          <InputMask mask="+55 99 99999-9999">
            <Input type="text" id="phone" />
          </InputMask>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password">Senha</label>
          <Input type="password" id="password" />
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword">Confirmar senha</label>
          <Input type="password" id="confirmPassword" />
        </div>

        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

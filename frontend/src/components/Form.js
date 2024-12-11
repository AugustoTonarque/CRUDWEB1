import axios from "axios";
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { toast } from "react-toastify";

const FormContainer = styled.form`

    display: flex;
    align-items: flex-end;
    gap: 10px;
    flex-wrap: wrap;
    background-color: #ccc;
    padding: 20px;
    box-shadow: 0px 0px 0px #ccc;
    border-radius: 5px;
`;

const InputArea = styled.div`

    display: flex;
    flex-direction: column;
`;

const Input = styled.input`

    width: 120px;
    padding: 0 10px;
    border: 1px solid #bbb;
    border-radius: 5px;
    height: 40px;
`;

const Label = styled.label``;

const Button = styled.button`

    padding: 10px;
    cursor: pointer;
    border-radius: 5px;
    border: none;
    background-color: #2c73d2;
    color: white;
    height: 42px;
`;

const Form = ({ getUsers, onEdit, setOnEdit, }) => {
    const ref = useRef();

    useEffect(() => {
        if (onEdit) {
            const user = ref.current;

            user.nome.value = onEdit.nome;
            user.nota.value = onEdit.nota;
            user.presença.value = onEdit.presença;
        }
    }, [onEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const user = ref.current;
    
        // Validação de campos vazios
        if (!user.nome.value || !user.nota.value || !user.presença.value) {
            return toast.warn("Preencha todos os campos!");
        }
    
        // Validação do nome (não permite números)
        if (/\d/.test(user.nome.value)) {
            return toast.warn("O nome não pode conter números!");
        }
    
        // Validação da nota (entre 0 e 100)
        const nota = parseFloat(user.nota.value);
        if (isNaN(nota) || nota < 0 || nota > 100) {
            return toast.warn("A nota deve ser um número entre 0 e 100!");
        }
    
        // Validação da presença (entre 0 e 100)
        const presenca = parseFloat(user.presença.value);
        if (isNaN(presenca) || presenca < 0 || presenca > 100) {
            return toast.warn("A presença deve ser um número entre 0 e 100!");
        }
    
        // Faz a requisição ao backend
        try {
            if (onEdit) {
                await axios
                    .put("http://localhost:8800/" + onEdit.id, {
                        nome: user.nome.value,
                        nota: nota,
                        presença: presenca,
                    })
                    .then(({ data }) => toast.success(data));
            } else {
                await axios
                    .post("http://localhost:8800", {
                        nome: user.nome.value,
                        nota: nota,
                        presença: presenca,
                    })
                    .then(({ data }) => toast.success(data));
            }
        } catch ({ response }) {
            toast.error(response.data);
        }
    
        user.nome.value = "";
        user.nota.value = "";
        user.presença.value = "";
        setOnEdit(null);
        getUsers();
    };


    return (
        <FormContainer ref={ref} onSubmit= {handleSubmit}>
            <InputArea>
                <Label> Nome </Label>
                <Input name="nome" />            
            </InputArea>
            <InputArea>
                <Label> Nota </Label>
                <Input name="nota" />            
            </InputArea>
            <InputArea>
                <Label> Presença </Label>
                <Input name="presença" />            
            </InputArea>
            <Button type="submit">SALVAR</Button>

        </FormContainer>
    );
};

export default Form;
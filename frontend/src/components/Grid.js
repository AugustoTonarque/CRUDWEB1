import React from "react";
import axios from "axios";
import styled from "styled-components";
import { FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";

const Table = styled.table`

    width: 100%;
    background-color: #fff;
    padding: 20px;
    box-shadow: 0px 0px 10px #ccc;
    border-radius: 5px;
    max-width: 800px;
    margin: 20px auto;
`;

export const Thead = styled.thead``;

export const Tbody = styled.tbody``;

export const Tr = styled.tr``;

export const Th = styled.th`

    text-align: start;
    border-bottom: inset;
    padding-bottom: 5px;
`;

export const Td = styled.td`

    padding-top: 15px;
    text-aling: ${(props) => (props.alignCenter ? "center" : "start")};
    width: ${(props) => (props.width ? props.width: "auto")};
    white-space: nowrap;
    align-items: center;
    justify-content: ${(props) => (props.alignCenter ? "center" : "flex-start")};
`;

const Situation = styled.span`
    color: ${(props) => (props.approved ? "green" : "red")};
    font-weight: bold;
`;

const Grid = ({ users, setUsers, setOnEdit }) => {

    const handleEdit = (item) => {
        setOnEdit(item);
    };

    const handleDelete = async (id) => {
        await axios
        .delete("http://localhost:8800/" + id)
        .then(({ data }) => {
            const newArray = users.filter((user) => user.id !== id);

            setUsers(newArray);
            toast.success(data);
        })

        .catch(({ data }) => toast.error(data));

        setOnEdit(null);
    };

    const getSituation = (nota, presença) => {
        if (nota >= 70 && presença >= 75) {
            return { text: "APROVADO", approved: true };
        } else {
            return { text: "REPROVADO", approved: false };
        }
    };



    return (
        <Table>
            <Thead>
                <Tr>
                    <Th width="30%">Nome</Th>
                    <Th width="20%">Nota</Th>
                    <Th width="20%">Presença</Th>
                    <Th width="20%">Situação</Th>
                    <Th width="10%">Ações</Th>
                </Tr>
            </Thead>
            <Tbody>
                {users.map((item, i) => {
                    const situation = getSituation(item.nota, item.presença);
                    return (
                        <Tr key={i}>
                            <Td width="20%">{item.nome}</Td>
                            <Td width="20%">{item.nota}</Td>
                            <Td width="20%">{item.presença}</Td>
                            <Td width="20%">
                                <Situation approved={situation.approved}>
                                    {situation.text}
                                </Situation>
                            </Td>
                            <Td width="10%">
                                <FaEdit
                                    style={{
                                        cursor: "pointer",
                                        marginRight: "10px",
                                    }}
                                    onClick={() => handleEdit(item)}
                                />
                                <FaTrash
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleDelete(item.id)}
                                />
                            </Td>
                        </Tr>
                    );
                })}
            </Tbody>
        </Table>
    );
};

export default Grid;
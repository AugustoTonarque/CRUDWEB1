import { db } from "../db.js";

export const getUsers = (_, res) => {
    const q = "SELECT * FROM usuarios";

    db.query(q, (err, data) => {
        if (err) return res.json(err);

        return res.status(200).json(data);
    });
};

export const addUser = (req, res) => {
    const { nome, nota, presença } = req.body;

    // Validação do nome (não pode conter números)
    if (/\d/.test(nome)) {
        return res.status(400).json("O nome não pode conter números!");
    }

    // Validação da nota e presença (devem estar entre 0 e 100)
    if (nota < 0 || nota > 100 || presença < 0 || presença > 100) {
        return res.status(400).json("Nota e presença devem estar entre 0 e 100!");
    }

    const q = "INSERT INTO usuarios(`nome`, `nota`, `presença`) VALUES (?)";
    const values = [nome, nota, presença];

    db.query(q, [values], (err) => {
        if (err) return res.status(500).json(err);

        return res.status(200).json("Nota lançada com sucesso");
    });
};
export const updateUser = (req, res) => {

    const q =
    "UPDATE usuarios SET `nome` = ?, `nota` = ?, `presença` = ? WHERE `id` = ?";

    const values = [
        req.body.nome,
        req.body.nota,
        req.body.presença,
    ];

    db.query(q,[...values, req.params.id], (err) => {
        if (err) return res.json(err);

        return res.status(200).json("Nota atualizada com sucesso.");
    });

};

export const deleteUser = (req, res) => {

    const q = "DELETE FROM usuarios WHERE `id` = ?";
    
    db.query(q, [req.params.id], (err) => {
        if(err) return res.json(err);

        return res.status(200).json("Nota deletada com sucesso.");
    });

};
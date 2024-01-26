CREATE TABLE clientes (
    id INT PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(255),
    telefone VARCHAR(15),
    casa VARCHAR(50),
    x NUMERIC,
    y NUMERIC
);

INSERT INTO clientes (id, nome, email, telefone, casa, x, y)
VALUES
    (1, 'Pedro Henrique Brito Obara', 'Pedrobara23@gmail.com', '67981687046', '5', 2, 1),
    (2, 'PEDRO HENRIQUE BRITO OBARA', 'obara762@gmail.com', '67981687046', '7', 4, 1),
    (3, 'Ana Carolina', 'ana_obesso@hotmail.com', '6795154666', '1', 1, 4),
    (4, 'joao pedro', 'joa@gmail.copm', '779988446633', '4', 1, 1),
    (5, 'carlos', 'calor@gmail.com', '15541614', '6', 3, 1),
    (6, 'paulo andre', 'paulo@gmail.com', '99658441', '3', 1, 2),
    (7, 'andre', 'andre@gmail.com', '984563214', '2', 1, 3),
    (8, 'jao paulo', 'jo@hotmail.com', '987561245', '8', 5, 1),
    (9, 'jao paulo', 'joaopaulo@gmail.com', '55698478563', '10', 3, 4),
    (10, 'patrica', 'patricia@gmail.com', '4586956545', '12', 6, 4),
    (11, 'joana', 'joana@gmail.com', '457862541', '9', 6, 1),
    (12, 'ana', 'ana@gmail.com', '786541235', '11', 5, 4),
    (13, 'EMPRESA', 'empresa@gmail.com', '1122334455', '0', 0, 0);

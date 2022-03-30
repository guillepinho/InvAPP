'use strict'

const openModal = () => { 
    document.getElementById('modal').classList.add('active');
}

const closeModal = () => {
    clearFields();
    document.getElementById('modal').classList.remove('active');
}

const getLocalStorage = () => JSON.parse(localStorage.getItem('dbProduto')) ?? [];
const setLocalStorage = (dbProduto) => localStorage.setItem('dbProduto', JSON.stringify(dbProduto));

// CRUD - CREATE
const createProduto = (produto) => {
    const dbProduto = getLocalStorage();
    dbProduto.push(produto)
    setLocalStorage(dbProduto);
}

// CRUD - READ
const readProduto = () => getLocalStorage();

// CRUD - UPDATE
const updateProduto = (index, produto) => {
    const dbProduto = readProduto();
    dbProduto[index] = produto;
    setLocalStorage(dbProduto);
}

// CRUD - DELETE
const deleteProduto = (index) => {
    const dbProduto = readProduto();
    dbProduto.splice(index, 1);
    setLocalStorage(dbProduto);
}

// Interação c/ Layout
const isValidFields = () => {
    return document.getElementById('formCadastro').reportValidity();
}

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field');
    fields.forEach(field => field.value = '');
}

const saveProduto = () => {
    if (isValidFields()) {
        const novoProduto = {
            nome: document.getElementById('nome').value,
            tipo: document.getElementById('tipo').value,
            qtd: document.getElementById('qtd').value,
        }
        const index = document.getElementById('nome').dataset.index;
        if (index == 'new') {
            createProduto(novoProduto);
            closeModal();
            updateTable();
        }
        else {
            updateProduto(index, novoProduto);
            closeModal();
            updateTable();
        }
    }
}

// Atualiza Tabela
const createRow = (produto, index) => {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${produto.nome}</td>
        <td>${produto.tipo}</td>
        <td>${produto.qtd}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}">Excluir</button>
            <button type="button" class="button yellow" id="use-${index}">Usar</button>
        </td>    
    `
    document.querySelector('#inventario>tbody').appendChild(newRow);
}

const updateTable = () => {
    const dbProduto = readProduto();
    clearTable();
    dbProduto.forEach(createRow);
}

const clearTable = () => {
    const rows = document.querySelectorAll('#inventario>tbody tr');
    rows.forEach(row => row.parentNode.removeChild(row));
}

// Editando, Deletando e Usando
const editDeleteUse = (event) => {
    if (event.target.type == 'button') {
        const [action, index] = event.target.id.split('-');
        
        if (action == 'edit') {
            editProduto(index);
        }
        else if (action == 'delete') {
            const produto = readProduto()[index];
            const response = confirm (`Deseja realmente excluir o produto ${produto.nome}?`);
            if (response == true) {
                deleteProduto(index);
                updateTable();
            }
        }
        else {
            useProduto(index);
        }
    }   
}

const editProduto = (index) => {
    const produto = readProduto()[index];
    produto.index = index;
    fillFields(produto);
    openModal();
}

const fillFields = (produto) => {
    document.getElementById('nome').value = produto.nome;
    document.getElementById('tipo').value = produto.tipo;
    document.getElementById('qtd').value = produto.qtd;
    document.getElementById('nome').dataset.index = produto.index;
}

const useProduto = (index) => {
    const produto = readProduto()[index];
    const newNum = JSON.parse(produto.qtd) - 1;
    if (newNum >= 0) {
        const novoProduto = {
            nome: produto.nome,
            tipo: produto.tipo,
            qtd: newNum.toString(),
        }
        updateProduto(index, novoProduto);
        updateTable();
    }
    else {
        alert('Não é possível diminuir o produto a um valor abaixo de 0!')
    }
}

updateTable();

// Eventos e Listeners
document.getElementById('cadastrarItem').addEventListener('click', openModal);

document.getElementById('modalClose').addEventListener('click', closeModal);

document.getElementById('cancelar').addEventListener('click', closeModal);

document.getElementById('salvar').addEventListener('click', saveProduto);

document.querySelector('#inventario>tbody').addEventListener('click', editDeleteUse);
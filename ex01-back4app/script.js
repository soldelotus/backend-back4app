const olTarefas = document.getElementById("olTarefas");
const btCarregar = document.getElementById("btCarregar");
const inputTarefa = document.getElementById("inputTarefa");
const btAdicionar = document.getElementById("btAdicionar");
const cbNaoConcluidas = document.getElementById("cbNaoConcluidas");

const tarefaURL = "https://parseapi.back4app.com/classes/Tarefa";
const headers = {
  "X-Parse-Application-Id": "MrPbcVVsq018ifwoWboJo7AJLspTohz72MDPAoWi",
  "X-Parse-REST-API-Key": "HRwnM8n08421mYmQN45jzvC6UW3MAb7OS54M9xAa",

};
const headersJson = {
  ...headers,
  "Content-Type": "application/json",
};

const getTarefas = async () => {
  let url = tarefaURL;
  const naoConcluidas = cbNaoConcluidas.checked;
  if (naoConcluidas) {
    const whereClause = JSON.stringify({ concluida: false });
    url = `${url}?where=${whereClause}`;
    url = encodeURI(url);
    console.log("url", url);
  }
  const response = await fetch(url, {
    method: "GET",
    headers: headers,
  });
  const data = await response.json();
  return data.results;
};

const listarTarefas = async () => {
  const listaTarefas = await getTarefas();
  listaTarefas.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  olTarefas.innerHTML = "";
  for (let i = 0; i < listaTarefas.length; ++i) {
    const tarefa = listaTarefas[i];
    const li = document.createElement("li");
    const text = document.createTextNode(`${tarefa.descricao} - concluída: `);
    const cb = document.createElement("input");
    cb.name = tarefa.objectId;
    cb.type = "checkbox";
    cb.checked = tarefa.concluida;
    cb.onchange = () => handleChangeCBTarefa(cb, tarefa);
    const button = document.createElement("button");
    button.innerHTML = "X";
    button.onclick = () => handleClickBtRemover(button, tarefa);
    li.appendChild(text);
    li.appendChild(cb);
    li.appendChild(button);
    olTarefas.appendChild(li);
  }
};

const handleChangeCBTarefa = async (cb, tarefa) => {
  cb.disabled = true;
  await fetch(`${tarefaURL}/${tarefa.objectId}`, {
    method: "PUT",
    headers: headersJson,
    body: JSON.stringify({ concluida: !tarefa.concluida }),
  });
  cb.disabled = false;
  listarTarefas();
};

const handleClickBtRemover = async (button, tarefa) => {
  button.disabled = true;
  await fetch(`${tarefaURL}/${tarefa.objectId}`, {
    method: "DELETE",
    headers: headers,
  });
  button.disabled = false;
  listarTarefas();
};

const adicionarTarefa = async () => {
  const descricao = inputTarefa.value;
  if (!descricao) {
    alert("Precisa digitar uma tarefa!");
    return;
  }
  btAdicionar.disabled = true;
  const response = await fetch(tarefaURL, {
    method: "POST",
    headers: headersJson,
    body: JSON.stringify({ descricao }),
  });
  btAdicionar.disabled = false;
  inputTarefa.value = "";
  inputTarefa.focus();
};

btCarregar.onclick = listarTarefas;
btAdicionar.onclick = adicionarTarefa;
cbNaoConcluidas.onchange = listarTarefas;

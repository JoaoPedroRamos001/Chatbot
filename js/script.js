const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const botaoTema = document.getElementById('botao-tema');
const corpo = document.body;

//função para formatar a resposta do chatbot
function formatResponse(text) {
  const formattedText = text
    .replace(/(\*\*.*?\*\*)/g, '<strong>$1</strong>') //negrito
    .replace(/(\* )/g, '<li>') //listas
    .replace(/(\n)/g, '<br>'); //uebras de linha

  return formattedText;
}

//enviar mensagem do usuario
function sendMessage() {
  const userMessage = userInput.value.trim();
  if (userMessage) {
    appendMessage(userMessage, 'user');
    userInput.value = '';
    fetchChatbotReply(userMessage);
  }
}
function appendMessage(message, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add(sender);

  //aadicionar a mensagem formatada
  messageDiv.innerHTML += formatResponse(message); 

  if (sender === 'bot') {
    //criar o ícone de copiar
const copyIcon = document.createElement('img');
copyIcon.src = '../images/copia-de.png'; 
copyIcon.alt = 'Copiar';
copyIcon.classList.add('copy-icon'); 
copyIcon.style.width = '20px'; 
copyIcon.style.height = '20px'; 
copyIcon.style.cursor = 'pointer'; 
copyIcon.onclick = () => copyToClipboard(message); 
    //criar um conteiner para a mensagem e o ícone
    const containerDiv = document.createElement('div');
    containerDiv.appendChild(copyIcon); 
    containerDiv.appendChild(messageDiv);

    chatBox.appendChild(containerDiv); //adiciona o contêiner ao chat
  } else {
    chatBox.appendChild(messageDiv); //adiciona a mensagem do usuário diretamente
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}

//buscar resposta do chatbot
function fetchChatbotReply(message) {
  fetch('http://127.0.0.1:5000/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.reply) {
        const formattedReply = formatResponse(data.reply); //formatar
        appendMessage(formattedReply, 'bot'); //adicionar a mensagem formatada
      }
    })
    .catch((error) => {
      console.error('Erro ao se comunicar com o backend:', error);
      appendMessage('Erro ao se comunicar com o servidor.', 'bot');
    });
}

//função para copiar a mensagem do bot
function copyToClipboard(text) {
  //<br> 
  const cleanText = text.replace(/<br\s*\/?>/gi, ''); 
  navigator.clipboard.writeText(cleanText).then(() => {
    alert(" " + cleanText);
  }).catch(err => {
    console.error("Erro ao copiar: ", err);
  });
}

//evento de clique no botao de enviar
sendButton.addEventListener('click', sendMessage);

//evento de pressionar a tecla Enter
userInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

//alternar tema
botaoTema.addEventListener('change', () => {
  corpo.dataset.tema = corpo.dataset.tema === 'claro' ? 'escuro' : 'claro';
});
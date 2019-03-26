console.log('this is loggggg')

const socket = io('http://localhost:3000/', { forceNew: true });

const form = document.getElementById('form');
const textInput = document.getElementById('textInput');
const messages = document.getElementById('messages');

const onSubmit = event => {
    event.preventDefault();
    socket.emit('sendmessages', textInput.value);
    console.log('this chat messages ', textInput.value);

    textInput.value = '';
}


const onReceiveMessage = message => {
    const liElement = document.createElement('LI')
    const textNode = document.createTextNode(message)
    liElement.appendChild(textNode)
    messages.appendChild(liElement);
    console.log('this is receiveMessages ')
}

form.addEventListener('submit', onSubmit)

socket.on('send messages', onReceiveMessage)

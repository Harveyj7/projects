class ChatBox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatContainer: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        }
        this.state = false;
        this.messages = [];
    }

    display() {
        const {openButton, chatContainer, sendButton} = this.args;

        openButton.addEventListener('click', () => this.toggleState(chatContainer))

        sendButton.addEventListener('click', () => this.onSendButton(chatContainer))

        const node = chatContainer.querySelector('input');
        node.addEventListener("keyup", ({key}) => {
            if (key === 'Enter') {
                this.onSendButton(chatContainer);
            }
        })
    }

    toggleState(chatContainer) {
        this.state = !this.state;
        if(this.state) {
            chatContainer.classList.add('chatbox--active');
        } else {
            chatContainer.classList.remove('chatbox--active');
        }
    }

    onSendButton(chatContainer) {
        var textField = chatContainer.querySelector('input');
        var textFieldValue = textField.value;

        if (textFieldValue === "") {
            return;
        }

        let msg1 = {name: "User", message: textFieldValue}
        this.messages.push(msg1);
        
        fetch('http://localhost:5000/predict', {
            method: 'POST',
            body: JSON.stringify({message: textFieldValue}),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            let msg2 = {name: "Sam", message: data.answer}
            this.messages.push(msg2);
            this.updateChatTextContainer(chatContainer);
            textField.value = '';
        }).catch(err => {
            console.log(err);
            let msg2 = {name: "Sam", message: "Server not responding. Please check if the server is running."}
            this.messages.push(msg2);
            this.updateChatTextContainer(chatContainer);
            textField.value = '';
        })
    }

    updateChatTextContainer(chatContainer) {
        var html = '';
        this.messages.slice().reverse().forEach(function(item, index) {
            if(item.name === "User") {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>'
            } else {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
            }
        });
        const chatMessage = chatContainer.querySelector('.chatbox__messages');
        chatMessage.innerHTML = html;
    }
    
        
}

const chatbox = new ChatBox();
chatbox.display();

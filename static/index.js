document.addEventListener('DOMContentLoaded', function () {
    const sendButton = document.querySelector('#send-button');
    const input = document.querySelector('#word-input');
    const attemptsCard = document.querySelector('#word-attempts')
    const tableBody = document.querySelector('#table-body');
    const wordAttempts = [];
    const errorMessage = document.querySelector('#error')

    function sortBySimilarityAscending(arr) {
        return arr.slice().sort((a, b) => a.similarity - b.similarity);
    }
    function processText() {
        attemptsCard.removeAttribute("hidden");
        const text = input.value;
        fetch('/api/process_text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: text })
        })
        .then(response => response.json())
        .then(data => {
            //empty input field
            input.value='';
            //check response and display error message or sorted attempts array
            if (data.error) {
                errorMessage.innerHTML = data.error
            } else {
                wordAttempts.push(data);
                //sort attempts
                const sortedWordAttempts = sortBySimilarityAscending(wordAttempts)
                tableBody.innerHTML= ""
                //return sorted datas in table
                sortedWordAttempts.forEach((data, index) => {
                    const newRow = document.createElement('tr');
                    newRow.innerHTML = `
                        <th scope="row">${index + 1}</th>
                        <td>${data.text}</td>
                        <td>${data.similarity}</td>
                    `;
                    tableBody.appendChild(newRow);
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Add item on click
    sendButton.addEventListener('click', processText);

    // Add item on enter
    input.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            processText();
        }
    });
});

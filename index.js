import data from "./data.json" assert {type: "json"}

let roundCounter = 0
const rand = () => Math.floor(Math.random() * data.questions.length)

const displayQuestion = ({answered, question, answers}) => {
    if(!answered){
        document.querySelector(".question").innerText = question
        Array.from(document.querySelector(".answer-container").children).map((item, index) => {
            item.innerText = answers[index].answer
        })
        return false
    } return true
}

const setAnswerButtonsToDefault = () => {
    Array.from(document.querySelector(".answer-container").children).map(btn => {
        btn.classList.remove("selected-btn")
    })
}

const handleCorrectAnswer = () => {
    Array.from(document.querySelector(".answer-container").children).map(btn => {
        (btn.classList.contains("selected-btn")) ?
        btn.classList.add("correct-answer") :
        btn.classList.add("incorrect-answer")
    })
}

const handleIncorrectAnswer = (answer) => {
    Array.from(document.querySelector(".answer-container").children).map(btn => {
        if(btn.classList.contains("selected-btn")){
            btn.classList.remove("selected-btn")
            btn.classList.add("incorrect-answer")
        } else if(btn.innerText === answer){
            btn.classList.add("correct-answer")
        }
    })
}

const checkAnswer = (userAnswer, answer) => {
    (userAnswer === answer) ? handleCorrectAnswer()  : handleIncorrectAnswer(answer)
    return userAnswer === answer
}

const resetCSSClasses = () => {
    Array.from(document.querySelector(".reward-container").children).map(element => {
        element.classList.remove("active-reward")
    })

    Array.from(document.querySelector(".answer-container").children).map(element => {
        element.classList.remove("incorrect-answer", "correct-answer", "selected-btn")
        element.classList.add("answer-hover")
        element.style.cursor = "pointer"
    })

    document.getElementById("stop-button").style.display = "block"
}

// Using cloneNode for the "side effect" of removing event listeners from buttons
const removeAnswerBtnEventListeners = () => {
    const buttons = document.querySelector(".answer-container")
    buttons.replaceWith(buttons.cloneNode(true))
}

const setFinalRewardIfWin = () => {
    return "5.000.000 Ft!"
}

const setFinalRewardIfLose = () => {
    switch(roundCounter){
        case 0: 
            return "0 Ft!"
            break
        case 1:
        case 2:
        case 3:
        case 4:
            return "5000 Ft!"
            break
        case 5:
        case 6:
        case 7:
            return "100.000 Ft!"
            break
        case 8:
        case 9:
            return "1.000.000 Ft!"
            break
    }
}

const setFinalRewardIfStop = () => {
    const activeReward = Array.from(document.querySelector(".reward-container").children).find(item => item.classList.contains("active-reward"))
    return `${activeReward.previousElementSibling.innerText} Ft!`
}

const handleAnswerButtons = (correctAnswer) => {
    Array.from(document.querySelector(".answer-container").children).map(btn => {
        btn.addEventListener("click", event => {
            setAnswerButtonsToDefault()
            document.getElementById("stop-button").style.display = "none"
            document.querySelectorAll(".answer").forEach(classElement => {
                classElement.style.cursor = "none"
                classElement.classList.remove("answer-hover")
            })
            event.target.classList.add("selected-btn")
           setTimeout(() => {
                if(checkAnswer(event.target.innerText, correctAnswer)){
                    if(roundCounter > 8) {
                        document.getElementById("game-over-text").innerText = `Gratulálunk! A nyereményed ${setFinalRewardIfWin()}`
                        document.getElementById("stop-button").style.display = "none"
                        document.getElementById("new-game-button").style.display = "block"
                        document.querySelector(".answer-container").style.pointerEvents = "none"
                    } else {
                        setTimeout(() => {
                            roundCounter += 1
                            round()
                        }, 5000)
                    }                    
                } else {
                    document.getElementById("game-over-text").innerText = (roundCounter === 0) ? "Sajnáljuk! A nyereményed 0 Ft!" : `Gratulálunk! A nyereményed ${setFinalRewardIfLose()}`
                    document.getElementById("stop-button").style.display = "none"
                    document.getElementById("new-game-button").style.display = "block"
                    document.querySelector(".answer-container").style.pointerEvents = "none"
                }
            }, 2000)
        })
    })
}

const round = () => {
    resetCSSClasses()
    removeAnswerBtnEventListeners()
    let number = rand()
    let alreadyAnswered = displayQuestion(data.questions[number])
    if(alreadyAnswered){
        round()
    } else {
    data.questions[number].answered = true
    }
    handleAnswerButtons(data.questions[number].answers.find(element => element.correct === true).answer)
    Array.from(document.querySelector(".reward-container").children)[roundCounter].classList.add("active-reward")
}

document.getElementById("stop-button").addEventListener("click", (event) => {
    event.target.style.display = "none"
    if(roundCounter === 0){
        document.getElementById("game-over-text").innerText = `A nyereményed ${setFinalRewardIfLose()}`
    } else {
        document.getElementById("game-over-text").innerText = `A nyereményed ${setFinalRewardIfStop()}`
    }
    document.querySelector(".answer-container").style.pointerEvents = "none"
    document.getElementById("new-game-button").style.display = "block"
})

document.getElementById("new-game-button").addEventListener("click", () => location.reload())

round()

if (localStorage.getItem('quiz') === "passed"){
	const cardPreview = document.querySelector('.card__preview');

	cardPreview.innerText = "Вы уже получили свой купон";
	cardPreview.style.margin = "0 0 200px 0";
	cardPreview.style.fontSize = "32px";
	cardPreview.style.textAlign = "center";
}

let questionsAndAnswers;
let questionsAndAnswersData = [];

fetch("https://d-rusakov-wp.github.io/reality/questions-and-answers.json")

.then(response => {
	return response.json();
})

.then(data => {
	questionsAndAnswersData = data;
})

.catch(error => {
	console.log(error);
});

// get coupons
let coupons;
let couponsData = [];

fetch("https://d-rusakov-wp.github.io/reality/coupons.json")

.then(response => {
	return response.json();
})

.then(data => {
	couponsData = data;
})

.catch(error => {
	console.log(error);
});

const message = document.querySelector(".message");
const messageContent = document.querySelector(".message__content");
const messageClose = document.querySelector(".message--close");

const messageShow = () => {
	message.style.display = "flex";
	message.classList.add("message--show");

	setTimeout(() => {
		message.classList.remove("message--show");
	}, 4000);
}

const messageHide = () => {
	message.style.display = "none";
	message.classList.remove("message--show");
}

messageClose.addEventListener("click", () => {
	messageHide();
});

const formName = document.querySelector(".form__name");
const formEmail = document.querySelector(".form__email");
const formPhone = document.querySelector(".form__phone");
const formCheckbox = document.querySelector(".form__checkbox");

let phoneMask = IMask(formPhone, {
	mask: "(000) 000-00-00",
	lazy: false
});

let quizBtnStart = document.querySelector(".quiz__btn--start");

quizBtnStart.addEventListener("click", () =>{
	quizStart();
});

const quizStart = () => {
	if (formName.value === ""){
		messageContent.innerText = "Впишите имя";
		messageShow();
	} else if (!phoneMask.masked.isComplete){
		messageContent.innerText = "Впишите номер телефона";
		messageShow();
	} else {
		quiz();
	}
}

const quizContent = document.querySelector(".quiz__content");
let numberQuestion = 0;

const quiz = () => {
	document.querySelector(".card__preview").style.display = "none";
	document.querySelector(".card__content").style.display = "block";
	document.querySelector(".quiz__btn--start").style.display = "none";

	questionsAndAnswers = [...questionsAndAnswersData];

	createItem();
}

const quizBtnPrev = document.querySelector(".quiz__btn--prev");
const quizBtnNext = document.querySelector(".quiz__btn--next");

quizBtnPrev.addEventListener("click", () => {
	numberQuestion--;
	createItem();
	chooseAnswer();
	changeProgress();
});

quizBtnNext.addEventListener("click", () => {
	chooseAnswer();

	if (selectAnswer[numberQuestion] === undefined) {
		messageContent.innerText = "Пожалуйста, выберите вариант ответа";
		messageShow();
	} else {
		numberQuestion++;

		if (numberQuestion > 0){
			createItem();
		}

		changeProgress();
	}
});

const progress = document.getElementById("progress");

const changeProgress = () => {
	progress.style.width = `${(numberQuestion / 5) * 100}%`;
}

let selectAnswer = [];

const chooseAnswer = () => {
	let answerChecked = document.querySelector("input[name='answer']:checked");

	if(answerChecked !== null){
		selectAnswer[numberQuestion] = +answerChecked.value;
	}
}

const quizItem = document.querySelector(".quiz__item");
const quizList = document.querySelector(".quiz__list");

const createItem = () => {
	quizContent.classList.add("quiz__content--fade-in");

	setTimeout(() => {
		quizContent.classList.remove("quiz__content--fade-in");
	}, 500);

	const quizTitle = document.querySelector(".quiz__title");
	const quizQuestion = document.querySelector(".quiz__question");

	if (quizTitle !== null && quizQuestion !== null){
		quizTitle.remove();
		quizQuestion.remove();
	}

	let childQuizList = quizList.lastElementChild;

	while (childQuizList) {
		quizList.removeChild(childQuizList);
		childQuizList = quizList.lastElementChild;
	}

	if(questionsAndAnswers[numberQuestion] !== undefined){
		quizItem.insertAdjacentHTML("afterbegin", `<h2 class="quiz__title">Вопрос № ${(numberQuestion + 1)}</h2><p class="quiz__question">${questionsAndAnswers[numberQuestion].question}</p>`);

		for (let i = 0; i < questionsAndAnswers[numberQuestion].answers.length; i++){
			let quizListItem = "<li class='quiz__option'><input class='quiz__input' type='radio' name='answer' value=" + i + " id=" + i + "><label class='quiz__label' for=" + i + "><span class='quiz__radio'></span><span>" + questionsAndAnswers[numberQuestion].answers[i] + "</span></label></li>";

			quizList.insertAdjacentHTML("beforeend", `${quizListItem}`);
		}
	}

	if (!(isNaN(selectAnswer[numberQuestion]))){
		document.querySelector(`input[value="${selectAnswer[numberQuestion]}"]`).checked = "true";
	}

	if (numberQuestion === 0){
		quizBtnPrev.style.display = "none";
		quizBtnNext.style.display = "inline-block";
	} else if (numberQuestion > 0 && numberQuestion !== 5){
		quizBtnPrev.style.display = "inline-block";
	} else if (numberQuestion == 5){
		quizContent.classList.add("quiz__content--fade-in");

		setTimeout(() => {
			quizContent.classList.remove("quiz__content--fade-in");
		}, 500);

		displayResult();

		quizBtnPrev.style.display = "none";
		quizBtnNext.style.display = "none";
	}
}

const displayResult = () => {
	document.querySelector(".social").classList.remove("social--hide");

	let correctAnswers = 0;

	for (let i = 0; i < selectAnswer.length; i++){
		if (selectAnswer[i] === questionsAndAnswers[i].answerTrue) {
			correctAnswers++;
		}
	}

	coupons = [...couponsData];

	let sale = '';
	let coupon = '';

	switch (correctAnswers) {
		case 5:
				sale = coupons[4].sale;
				coupon = coupons[4].coupon;

				break;
		case 4:
				sale = coupons[3].sale;
				coupon = coupons[3].coupon;

				break;
		case 3:
				sale = coupons[2].sale;
				coupon = coupons[2].coupon;

				break;

		case 2:
				sale = coupons[1].sale;
				coupon = coupons[1].coupon;

				break;
		case 1:
				sale = coupons[0].sale;
				coupon = coupons[0].coupon;
		default:
				sale = coupons[0].sale;
				coupon = coupons[0].coupon;
	}

	let valueFormName = document.querySelector(".form__name").value;

	quizContent.insertAdjacentHTML("afterbegin", "<div class='total'><span class='total__score'>Вы набрали " + correctAnswers + " из 5</span><span class='total__title'>" + valueFormName + ", Ваш купон:</span><div class='total__coupon coupon'><span class='coupon__sale'>" + sale + "</span><b class='coupon__code'>" + coupon + "</b><svg class='coupon__pattern' width='100%' height='12'><defs><pattern id='coupon__dots' width='22' height='22' patternUnits='userSpaceOnUse'><circle cy='13' cx='9' r='7' fill='#FFFFFF' /></pattern></defs><rect width='100%' height='22px' fill='url(#coupon__dots)'/></svg></div></div>");

	fetch(`https://api.telegram.org/bot7107876888:AAEEbojuBrx0MjG3CdrQY3K87oAI_5uWZU8/sendMessage?chat_id=917412386&parse_mode=html&text=Имя: ${valueFormName}%0AТелефон: +7 ${document.querySelector(".form__phone").value}%0AСкидка: ${sale.replace(' скидка', '')}`);

	localStorage.setItem("quiz", "passed");
}

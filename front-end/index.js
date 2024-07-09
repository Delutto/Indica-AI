let isRecording = false;
let recognition;
let flowStep = int = 0;

const chatBox = document.getElementById('chatBox');

function postMessage(text, isUser = false) {
	const messageClass = isUser ? 'user' : 'bot';
	const messageSide = isUser ? 'justify-content: flex-end;' : '';
	const message = `<div class="message ${messageClass}" style="${messageSide}"><div class="text">${text}</div></div>`;
	chatBox.innerHTML += message;
	chatBox.scrollTop = chatBox.scrollHeight;
	document.getElementById('userInput').value = '';
}

function AIFlow(data, isUser = false) {
	const chatBox = document.getElementById('chatBox');
	const agent = isUser ? 'user' : 'bot';
	var BotAnswer = [];

	switch (flowStep) {
		case 0:
			const botMessage = "Olá! O que você deseja comer hoje?";
			postMessage("<b>Assistente:</b> " + botMessage);
			readMessage(botMessage);
			flowStep = 1;
			break;
		case 1:
			flowStep = 2;
			postMessage(data, true);
			buscarResposta(data);
			break;
		case 2:
			if (data == '"NADA_ENCONTRADO"' || data == '""NADA_ENCONTRADO""')
			{
				data = "Desculpe, não consegui encontrar algo que se encaixe no seu pedido.<br>Poderia me explicar com mais detalhes?"
				postMessage("<b>Assistente:</b> " + data, isUser);
				readMessage(data);
			}
			else
			{
				let BotAnswer = '';
				let jsonData;

				jsonData = JSON.parse(data);

				let itenscount = jsonData.menu.length;

				console.log(itenscount);

				if (itenscount > 1)
				{	
					BotAnswer = "Aqui estão alguns itens que escolhi para você:";
				}
				else
				{
					BotAnswer = "Escolhi esse item para você:";
				}

				postMessage("<b>Assistente:</b> " + BotAnswer);
				readMessage(BotAnswer);

				BotAnswer = '';

				jsonData.menu.forEach(item =>{
					let tmpAnswer = '';
					BotAnswer = `<h4>${item.item}</h4>`;
					readMessage(BotAnswer);
					tmpAnswer += `<i>${item.description}</i><br>`;
					const formatter = new Intl.NumberFormat('pt-BR',
					{
						style: 'currency',
						currency: 'BRL'
					});
					const pricetemp = formatter.format(item.price);
					tmpAnswer += `<p>${pricetemp}</p>`;
					readMessage(tmpAnswer);
					BotAnswer += tmpAnswer;
					tmpAnswer = '';

					BotAnswer += `<img src="${item.img}" width=200px><br>`;
					BotAnswer += `<a href="${item.url}">Confira</a><br><br>`;

					postMessage(BotAnswer);
				});	
				
				BotAnswer = 'Encontrou o que deseja? Estou a disposição para mais dicas, é só me perguntar.';
				postMessage("<b>Assistente:</b> " + BotAnswer);
				readMessage(BotAnswer);
			}
			flowStep = 1;
			break;
		default:
			flowStep = 1;
			break;
	}
}

function toggleMinimize() {
	const chatContainer = document.getElementById('chatContainer');
	chatContainer.classList.toggle('minimized');

	if (!chatContainer.classList.contains('minimized') && (flowStep == 0)) {
		AIFlow(null, false);
	}
}

document.addEventListener('DOMContentLoaded', () => {
	document.getElementById('button-send').addEventListener('click', () => {
		const userInput = document.getElementById('userInput').value.trim();
		AIFlow(userInput, true);
	});

	document.getElementById('userInput').addEventListener('keypress', (e) => {
		if (e.key === 'Enter') {
			const userInput = document.getElementById('userInput').value.trim();
			AIFlow(userInput, true);
		}
	});
});

function buttonClick() {
	const userInput = document.getElementById('userInput').value.trim();
	AIFlow(userInput, true);
}

function toggleRecording() {
	if (isRecording) {
		recognition.stop();
		isRecording = false;
		document.getElementById('recordButton').innerHTML = '<img src="https://raw.githubusercontent.com/Delutto/Indica-AI/main/img/mic.png">';
	}
	else {
		startRecording();
	}
}

function startRecording() {
	recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
	recognition.lang = 'pt-BR';
	recognition.interimResults = true;
	recognition.maxAlternatives = 1;

	recognition.start();
	isRecording = true;
	document.getElementById('recordButton').innerText = '🔴';
	recordButton.style.width = '76px';
	recordButton.style.fontSize = '25px';

	recognition.onresult = function (event) {
		const transcript = event.results[0][0].transcript;
		document.getElementById('userInput').value = transcript;
	};

	recognition.onspeechend = function () {
		recognition.stop();
		isRecording = false;
		document.getElementById('recordButton').innerHTML = '<img src="./img/mic2.png">';
		transcript = document.getElementById('userInput').value.trim();
		AIFlow(transcript, true);


	};

	recognition.onerror = function (event) {
		console.error('Speech recognition error detected: ' + event.error);
		isRecording = false;
		document.getElementById('recordButton').innerHTML = '<img src="https://raw.githubusercontent.com/Delutto/Indica-AI/main/img/mic.png">';

	};
}

function stopReading() {
	const listenText = document.getElementById('ouvirTextos')
	listenText.addEventListener('click', () => {
		//console.log('EPA, Novo')
		speechSynthesis.cancel();
	})
}

function readMessage(text) {
	const speech = new SpeechSynthesisUtterance();
	speech.lang = 'pt-BR';
	speech.text = text;

	speechSynthesis.speak(speech);
}


document.getElementById('alterarContraste').addEventListener('click', function () {
	document.body.classList.toggle('dark-mode');
	document.getElementById('chatContainer').classList.toggle('dark-mode');

	const recordButton = document.getElementById('recordButton')
	const ouvirTextos = document.getElementById('ouvirTextos')
	const alterarContraste = document.getElementById('alterarContraste')
	const alterarTamanho = document.getElementById('alterarTamanho')
	const chatButton = document.getElementById('chat')

	if (document.body.classList.contains('dark-mode')) {


		//console.log('darkmode')
		recordButton.children[0].attributes[0].nodeValue = './img/micDark.png'
		ouvirTextos.children[0].attributes[0].nodeValue = 'img/hearingDark.png'
		alterarContraste.children[0].attributes[0].nodeValue = './img/contrastDark.png'
		alterarTamanho.children[0].attributes[0].nodeValue = './img/zoomDark.png'
		chatButton.src = './img/chatDark.png'

	} else {
		//console.log('lightmode')
		recordButton.children[0].attributes[0].nodeValue = './img/mic2.png'
		ouvirTextos.children[0].attributes[0].nodeValue = 'img/hearing2.png'
		alterarContraste.children[0].attributes[0].nodeValue = './img/contrast2.png'
		alterarTamanho.children[0].attributes[0].nodeValue = './img/zoom.png'
		chatButton.src = './img/chat.png'
	}

});


document.getElementById('alterarTamanho').addEventListener('click', (e) => {
	const texts = document.querySelectorAll('.text');

	texts.forEach((text) => {
		let currentFontSize = parseFloat(window.getComputedStyle(text).fontSize);

		if (currentFontSize < 22) {
			// Aumenta a fonte em 2px
			text.style.fontSize = (currentFontSize + 2) + 'px';
		} else {
			// Se atingir 22px, volta para o tamanho padrão (16px)
			text.style.fontSize = '14px';
		}
	})
})

async function buscarResposta(pergunta) {
	let resposta = "";

	//console.log("Aguarde enquanto carregamos a resposta...");
	const loader = document.getElementById('loader1');
	loader.style.display = 'block';

	const body = {
		'model': 'gpt-4o',
		'temperature': 0.7,
		'messages': [
			{
				"role": "user",
				"content": "Você irá agir como um assistente virtual de uma loja de fast-food online, oferecendo sugestões de produtos dessa loja, e respondendo seguindo os seguintes critérios: * Fornecerei um arquivo JSON com todos os itens disponíveis a venda na loja; * Mesmo que apenas um item seja encontrado, o JSON deve conter o array 'menu'; * Utilize APENAS as informações do arquivo JSON fornecido; * Responda resumidamente; * Leve em consideração que os público alvo são pessoas com algum tipo de deficiência ou deficiência do espectro autista; * Sua resposta deve ser no formato JSON, separando os elementos seguindo o modelo do JSON fornecido, para ser consumida por uma aplicação de terceiros; * Caso não seja encontrado nenhum item que se encaixe na solicitação do usuário, responda apenas com a palavra 'NADA_ENCONTRADO'"
			},
			{
				"role": "user",
				"content": `{'menu':[{'item':'Hambúrguer de Picanha','description':'Queijo cheddar, alface, tomate, molho especial e picanha','price':36.99,'img':'https://client-assets.anota.ai/produtos/64b833a95ca9640019eb1ccd/-1720124750110blob_600.webp','url':'https://pedido.anota.ai/product-details/6685a94ee94be0001c711210/pagina-teste-marcos-nascimento','category':'Hambúrguers','tags':['salgado','salgados','salgada','salgadas','carne','gado','rês','bovino','bovina','picanha','hambúrguer','hambúrgueres','burguer','burguers','burger','burgers','promoção','promoções','promocional','promocionais','desconto','descontos','barato','baratos','barata','baratas','pechincha','combo','combos','Queijo','lanche','lanches','lanchinho','lanchinhos','lanchezinho','lanchezinhos','sanduíche','sanduíches','sanduba','sandubas']},{'item':'Hambúrguer de Costela BBQ','description':'Molho barbecue, cebola roxa, picles e costela','price':32.99,'img':'https://client-assets.anota.ai/produtos/64b833a95ca9640019eb1ccd/-1720124767168blob_600.webp','url':'https://pedido.anota.ai/product-details/6685a9778d41fd22891ded0d/pagina-teste-marcos-nascimento','category':'Hamburguers','tags':['salgado','salgados','salgada','salgadas','carne','gado','rês','bovino','bovina','costela','hambúrguer','hambúrgueres','burguer','burguers','burger','burgers','desconto','descontos','barato','baratos','barata','baratas','pechincha','combo','combos','lanche','lanches','lanchinho','lanchinhos','lanchezinho','lanchezinhos','sanduíche','sanduíches','sanduba','sandubas']},{'item':'Pastel de Carne','description':'Pastel recheado com carne bovina','price':15.50,'img':'https://client-assets.anota.ai/produtos/64b833a95ca9640019eb1ccd/-1720125068157blob_600.webp','url':'https://pedido.anota.ai/product-details/6687068ff51f0e0028ff3cba/pagina-teste-marcos-nascimento','category':'Pastéis','tags':['salgado','salgados','salgada','salgadas','pastel','pastéis','frito','frita','fritura','carne','gado','rês','bovino','bovina','promoção','promoções','promocional','promocionais','desconto','descontos','barato','baratos','barata','baratas','pechincha','lanche','lanches','lanchinho','lanchinhos','lanchezinho','lanchezinhos']},{'item':'Pastel de Frango','description':'Pastel recheado com carne de frango','price':13.50,'img':'https://client-assets.anota.ai/produtos/64b833a95ca9640019eb1ccd/-1720125099160blob_600.webp','url':'https://pedido.anota.ai/product-details/668706aea7d434001cfe3ca2/pagina-teste-marcos-nascimento','category':'Pastéis','tags':['salgado','salgados','salgada','salgadas','pastel','pastéis','frito','frita','fritura','carne','frango','galinha','ave','promoção','promoções','promocional','promocionais','desconto','descontos','barato','baratos','barata','baratas','pechincha','combo','combos','lanche','lanches','lanchinho','lanchinhos','lanchezinho','lanchezinhos']},{'item':'Acai Puro','description':'Acai puro com leite condensado','price':15.00,'img':'https://client-assets.anota.ai/produtos/64b833a95ca9640019eb1ccd/-1720124903718blob_600.webp','url':'https://pedido.anota.ai/product-details/6687058fe94be0001c7cead0/pagina-teste-marcos-nascimento','category':'Acai','tags':['gelado','gelados','frio','frios','frias','organico','doce','doces','açucarado','sobremesa','barato','natural']},{'item':'Acai Premium com Confeti','description':'Acai Premium','price':19.00,'img':'https://client-assets.anota.ai/produtos/64b833a95ca9640019eb1ccd/-1720124840298blob_600.webp','url':'https://pedido.anota.ai/product-details/668705aa8d41fd228928af76/pagina-teste-marcos-nascimento','category':'Acai','tags':['gelado','gelados','frio','frios','frias','organico','doce','doces','açucarado','sobremesa','barato','natural','açais','açai']},{'item':'Sorvete de Chocolate','description':'Sorvete com gotas de chocolate','price':9.00,'img':'https://client-assets.anota.ai/produtos/64b833a95ca9640019eb1ccd/-1720124915624blob_600.webp','url':'https://pedido.anota.ai/product-details/6685b8451014d900278a124a/pagina-teste-marcos-nascimento','category':'Sorvetes','tags':['açucarado','barata','baratas','barato','baratos','desconto','descontos','gelado','gelados','doce','doces','frio','frios','frias']},{'item':'Sorvete de Avela','description':'Sorvete com Gotas de Nutella','price':9.00,'img':'https://client-assets.anota.ai/produtos/64b833a95ca9640019eb1ccd/-1720124930985blob_600.webp','url':'https://pedido.anota.ai/product-details/6685b854e94be0001c720e02/pagina-teste-marcos-nascimento','category':'Sorvetes','tags':['açucarado','barata','baratas','barato','baratos','desconto','descontos','gelado','gelados','doce','doces','frio','frios','frias']},{'item':'Pizza de Pepperoni Especial','description':'Pepperoni extra, queijo mozzarella','price':42.00,'img':'https://client-assets.anota.ai/produtos/64b833a95ca9640019eb1ccd/-1720124724719blob_600.webp','url':'https://pedido.anota.ai/product-details/6685a8ed8d41fd22891de779/pagina-teste-marcos-nascimento','category':'Pizzas','tags':['promocionais','folhado','desconto','assado','assados','assada','assadas','pizza','pizzas','focaccia','focaccias','lenha','carne','calabresa','salgado','salgados','salgada','salgadas','calzone','calzones']},{'item':'Pizza Margherita Gourmet','description':'Manjericão fresco, tomates fatiados, azeite de oliva','price':45.00,'img':'https://client-assets.anota.ai/produtos/64b833a95ca9640019eb1ccd/-1720124702464blob_600.webp','url':'https://pedido.anota.ai/product-details/6685a91fe94be0001c710e9c/pagina-teste-marcos-nascimento','category':'Pizzas','tags':['promocionais','folhado','desconto','assado','assados','assada','assadas','pizza','pizzas','focaccia','focaccias','lenha','carne','calabresa','salgado','salgados','salgada','salgadas','calzone','calzones']}]}`
			},
			{
				"role": "user",
				"content": pergunta
			}
		]
	};

	const response = await fetch('http://localhost:3000/api/proxy', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ body: body })
	});

	const result = await response.json();
	
	resposta = JSON.stringify(result.choices[0].message.content, (chave, value) => {
		if (typeof value === 'string')
		{
			value = value.replace('```json', '');
			value = value.replace('```', '');
			value = value.replace(/\n/g, '');
			value = value.replace(/\"/g, '"');
		}
		return value;
	});

	resposta = resposta.replace('"{', '{');
	resposta = resposta.replace('}"', '}');
	resposta = resposta.replace(/\\/g, '');

	console.log(resposta);

	loader.style.display = 'none';
	AIFlow(resposta);
}

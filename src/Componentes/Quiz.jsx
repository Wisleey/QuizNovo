import React, { useState, useEffect } from 'react';
import './Quiz.css';

const Quiz = () => {
  const [questoes, setQuestoes] = useState([]);
  const [indiceQuestaoAtual, setIndiceQuestaoAtual] = useState(0);
  const [pontuacao, setPontuacao] = useState(0);
  const [indiceRespostaSelecionada, setIndiceRespostaSelecionada] = useState(null);
  const [respostasSelecionadas, setRespostasSelecionadas] = useState([]);
  const [quizEncerrado, setQuizEncerrado] = useState(false);
  const url = "http://localhost:3000/Quiz";
  
/** Aqui esta toda parte responsavel pelo bd Falso */
  useEffect(() => {
     async function fetchQuestoes() {
      
        const res = await fetch(url);
        const data = await res.json();
        setQuestoes(data);
      
    };

    fetchQuestoes();
  }, []);

  

  const questaoAtual = questoes[indiceQuestaoAtual];
  const opcoesRespostaAtual = questaoAtual?.alternativas || [];
  const corretas = questaoAtual?.respostasCorretas || [];

  const mudancaResposta = (resposta) => {
    if (indiceRespostaSelecionada === null) {
      setIndiceRespostaSelecionada(resposta);
    } else {
      alert('Você só pode selecionar uma resposta.');
    }
  };

  const limparResposta = () => {
    setIndiceRespostaSelecionada(null);
  };

  const proximaQuestao = () => {
    if (quizEncerrado) {
      return;
    }

    if (indiceRespostaSelecionada !== null) {
      setRespostasSelecionadas([...respostasSelecionadas, opcoesRespostaAtual[indiceRespostaSelecionada]]);
      if (corretas.includes(indiceRespostaSelecionada)) {
        setPontuacao(pontuacao + 1);
      }
    } else {
      return;
    }

    if (indiceQuestaoAtual < questoes.length - 1) {
      setIndiceQuestaoAtual(indiceQuestaoAtual + 1);
      setIndiceRespostaSelecionada(null);
    } else {
      alert('Fim do quiz. Sua pontuação final: ' + pontuacao);
      setRespostasSelecionadas([...respostasSelecionadas, 'Pontuação Final: ' + pontuacao]);
      setQuizEncerrado(true);
    }
  };

  return (
    <div className="quiz-container">
      <h1>{questaoAtual?.questao}</h1>

      <div className="respostas">
        {opcoesRespostaAtual.map((opcaoResposta, resposta) => (
          <label key={resposta}>
            <input
              type="checkbox"
              checked={indiceRespostaSelecionada === resposta}
              onChange={() => mudancaResposta(resposta)}
            />
            {opcaoResposta}
          </label>
        ))}
      </div>

      <button
        className="limpar-button"
        onClick={limparResposta}
        disabled={indiceRespostaSelecionada === null}
      >
        Limpar Resposta
      </button>

      <button
        className="proximo-button"
        onClick={proximaQuestao}
        disabled={indiceRespostaSelecionada === null}
      >
        {indiceQuestaoAtual < questoes.length - 1 ? 'Próxima Pergunta' : 'Finalizar Quiz'}
      </button>

      <div className='Resposta'>
        <h4>Respostas Selecionadas:</h4>
        <ul>
          {respostasSelecionadas.map((resposta, index) => (
            <li key={index}>{resposta}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Quiz;

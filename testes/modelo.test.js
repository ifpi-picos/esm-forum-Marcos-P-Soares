const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

test('Testando cadastro de perguntas e respostas', () => {
  modelo.cadastrar_pergunta('Qual a capital da França?');
  modelo.cadastrar_pergunta('O que é 2 + 2?');

  const perguntas = modelo.listar_perguntas();
  expect(perguntas.length).toBe(2);
  expect(perguntas[0].texto).toBe('Qual a capital da França?');
  expect(perguntas[1].texto).toBe('O que é 2 + 2?');

  // Cadastrando respostas para as perguntas
  const idPergunta1 = perguntas[0].id_pergunta;
  const idPergunta2 = perguntas[1].id_pergunta;

  modelo.cadastrar_resposta(idPergunta1, 'Paris');
  modelo.cadastrar_resposta(idPergunta1, 'Londres');
  modelo.cadastrar_resposta(idPergunta2, '4');

  // Verificando número de respostas
  expect(modelo.get_num_respostas(idPergunta1)).toBe(2);
  expect(modelo.get_num_respostas(idPergunta2)).toBe(1);
});

test('Testando recuperação de perguntas e respostas', () => {
  modelo.cadastrar_pergunta('Qual é a cor do céu?');
  modelo.cadastrar_pergunta('Qual o maior planeta do sistema solar?');

  const perguntas = modelo.listar_perguntas();
  const idPergunta1 = perguntas[0].id_pergunta;
  const idPergunta2 = perguntas[1].id_pergunta;

  modelo.cadastrar_resposta(idPergunta1, 'Azul');
  modelo.cadastrar_resposta(idPergunta1, 'Cinza');
  modelo.cadastrar_resposta(idPergunta2, 'Júpiter');

  // Testando recuperação da pergunta
  const perguntaRecuperada = modelo.get_pergunta(idPergunta1);
  console.log("get_pergunta retornou:", perguntaRecuperada);
  expect(perguntaRecuperada).toBeDefined(); 
  expect(perguntaRecuperada.texto).toBe('Qual é a cor do céu?');

  // Testando recuperação de respostas
  const respostasPergunta1 = modelo.get_respostas(idPergunta1);
  const respostasPergunta2 = modelo.get_respostas(idPergunta2);

  expect(respostasPergunta1.length).toBe(2);
  expect(respostasPergunta1[0].texto).toBe('Azul');
  expect(respostasPergunta1[1].texto).toBe('Cinza');

  expect(respostasPergunta2.length).toBe(1);
  expect(respostasPergunta2[0].texto).toBe('Júpiter');
});

describe('Teste E2E - Cadastro de Resposta', () => {
  
    it('Deve cadastrar uma resposta para uma pergunta existente', () => {
      // Acessa a página inicial do ESM Forum
      cy.visit('/');
  
      // Aguarda até que pelo menos uma pergunta esteja carregada
      cy.get('tbody tr td a[href^="/respostas/?id_pergunta="]')
        .should('have.length.greaterThan', 0) // Garante que existe pelo menos uma pergunta
        .first()
        .click(); // Clica na primeira pergunta
  
      // Espera pelo campo de resposta e digita uma resposta
      cy.get('textarea[name="resposta"]', { timeout: 5000 })
        .should('be.visible')
        .type('Esta é uma resposta de teste gerada pelo Cypress.');
  
      // Clica no botão de enviar resposta
      cy.get('input[type="submit"]').click();
  
      // Confirma que foi redirecionado para a tela de sucesso
      cy.contains('Sua resposta foi cadastrada com sucesso.').should('be.visible');
  
      // Verifica se a resposta aparece na página da pergunta
      cy.get('a[href^="/respostas/?id_pergunta="]').first().click();
      cy.contains('Esta é uma resposta de teste gerada pelo Cypress.').should('be.visible');
    });
  
  });
  
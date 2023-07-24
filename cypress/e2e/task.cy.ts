describe('test task list page', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3001')
    })

    it('should render add task button', () => {
        cy.get('[data-test=new-task-button]').should('have.length', 1)
    })

    it('can add new task', () => {
        const newItem = 'Shopping'
        cy.get('[data-test=new-task-button]').click()
        cy.get('[data-test=new-task-title-input]').type(newItem)
        cy.get('[data-test=new-task-create-button]').click()

        cy.get('#task-list li')
            .should('have.length', 1)
            .last()
            .should('have.text', newItem)
    })
})
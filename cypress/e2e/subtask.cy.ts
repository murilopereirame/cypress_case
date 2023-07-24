describe('test task details page', () => {
    let session;

    before(() => {
        cy.visit('http://localhost:3001', {
            onBeforeLoad(win: Cypress.AUTWindow) {
                win.localStorage.clear()
            }
        })

        const taskName = 'Shopping'

        cy.get('[data-test=new-task-button]').click()
        cy.get('[data-test=new-task-title-input]').type(taskName)
        cy.get('[data-test=new-task-create-button]').click()

        cy.get('#task-list li').last().click()
    })

    afterEach(() => {
        // @ts-ignore
        cy.saveLocalStorage()
    })

    it('should render new subtask dialog', () => {
        cy.get('[data-test=new-subtask-button]').click()
        cy.get('#overlay').as("overlay")

        cy.get('[data-test=new-subtask-dialog-container] h3')
            .should('have.text', "New Sub Task")
        cy.get('[data-test=new-subtask-content]').should('exist')
        cy.get('[data-test=new-subtask-done]')
            .should('exist')
            .should("not.be.checked")
        cy.get('[data-test="new-subtask-create"]')
            .should('exist')

        cy.get('@overlay')
            .should("exist")
            .click({force: true})
            .should('not.exist')
    })

    context("adding subtasks", () => {
        beforeEach(() => {
            // @ts-ignore
            cy.restoreLocalStorage()
            cy.visit('http://localhost:3001')
            cy.get('#task-list li').last().click()
        })

        it('should add pending subtask', () => {
            const subTaskName = 'Rice'

            cy.get('[data-test=new-subtask-button]').click()
            cy.get('[data-test=new-subtask-content]').type(subTaskName)
            cy.get('[data-test=new-subtask-create]').click()

            cy.get('#subtask-list li')
                .should('have.length', 1)
                .last()
                .should('have.text', subTaskName)

            cy.get("#subtask-list li:last-child input")
                .should('not.be.checked')
        })

        it('should add done subtask', () => {
            const subTaskName = 'Beans'

            cy.get('[data-test=new-subtask-button]').click()
            cy.get('[data-test=new-subtask-content]').type(subTaskName)
            cy.get('[data-test=new-subtask-done]').check()
            cy.get('[data-test=new-subtask-create]').click()

            cy.get('#subtask-list li')
                .should('have.length', 2)
                .last()
                .should('have.text', subTaskName)

            cy.get("#subtask-list li:last-child input")
                .should('be.checked')
        })

        it('should undone subtask', () => {
            cy.get("#subtask-list li:last-child input")
                .uncheck()
                .should("not.be.checked")
        })

        it('should done subtask', () => {
            cy.get("#subtask-list li:last-child input")
                .check()
                .should("be.checked")
        })
    })
})
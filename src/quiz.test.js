import {expect, jest, test} from '@jest/globals';
import {adminAuthRegister} from './auth.js';
import {adminQuizNameUpdate, adminQuizRemove, adminQuizList, adminQuizInfo, adminAuizCreate, adminQuizDescriptionUpdate} from './quiz.js';
import {clear} from './other.js';
import {getData, setData} from './dataStore.js';

beforeEach(() => {
    clear();
})

describe('adminQuizList', () => {
    test('Non valid User Id', () => {
        let quizList1 = adminQuizList(999999999999999);
        expect(quizList1).toStrictEqual({error: 'Invalid User Id'});
        let quizList2 = adminQuizList(-1);
        expect(quizList2).toStrictEqual({error: 'Invalid User Id'});
    })

    test('User Id Quiz List successfully accessed', () => {
        let userId = adminAuthRegister("pogchamp@gmail.com", 'thisisvalidpassword', 'Steve', 'Jobs');
        let quizList = adminQuizList(userId);
        expect(quizList.quizzes).toBeDefined;
    })

})



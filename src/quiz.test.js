import {expect, jest, test} from '@jest/globals';
import {adminAuthRegister} from './auth.js';
import {adminQuizNameUpdate, adminQuizRemove, adminQuizList, adminQuizInfo, adminAuizCreate, adminQuizDescriptionUpdate} from './quiz.js';
import {clear} from './other.js';
import {getData, setData} from './dataStore.js';

describe('adminQuizList', () => {
    test('Non valid User Id', () => {
        clear();
        let userId = adminAuthRegister('fakeemail@gmail.com', 'abcde1234', 'John', 'Smith');
        let quizList = adminQuizList(userId);
        expect(quizList).toStrictEqual({error: 'Invalid User Id'})
    })

    test('User Id Quiz List successfully accessed', () => {
        clear();
        let userId = adminAuthRegister("pogchamp@gmail.com", 'thisisvalidpassword', 'Steve', 'Jobs');
        let quizList = adminQuizList(userId);
        expect(quizList.error).toBeDefined;
    })

})



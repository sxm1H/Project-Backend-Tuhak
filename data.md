```javascript
let data = {
  user: [
    {
      userId: 1,
      authUserId: 1,
      email: 'hayden.smith@unsw.edu.au',
      name: 'Hayden Smith',
      nameFirst: 'Hayden',
      nameLast: 'Smith',
      dateOfBirth: '25/04/2005',
      loginData: {
        numFailedPasswordsSinceLastLogin: 1,
        numSuccessfulLogins: 3,
        passwordData: {
          password: 'Basketball1',
          oldPassword: 'Soccer1',
          newPassword: 'Basketball1',
          strength: 'Weak',
        }
      },


      quizzes: [
        {
          quizId: 1,
          name: 'My Quiz',
          description: 'This is my quiz',
          timeCreated: 1683125870,
          timeLastEdited: 1683125871,
          questions: [
            {
              questionId: 1,
              questionPrompt: "What is the largest city in Australia?",
              choices: ["Sydney", "Melbourne", "Queensland", "Perth"],
              answer: "Sydney",
              scoreMultiplier: "2x",
            }
          ]
        }
      ]
    }

    
  ],
  quizRoom: {
    authUserId: 1,
    usersInQuizRoom: ["Nick", "Sami", "Samuel", "DunYao", "Dilhan"],
    nameOfQuiz: 'My Quiz',
    quizId: 1,
    roomId: 1,
    capacity: 5,
    scoreboardRoom: [24, 48, 0, 1000, 98]
  },
  userInQuizRoom: {
    userId: 1,
    roomId: 1,
    score: 1000,
  }
};
```

[Optional] short description: 

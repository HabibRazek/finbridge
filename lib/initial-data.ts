/**
 * Initial data for Bankify application
 * This is loaded when localStorage is empty
 */

export const initialData = {
  "users": [
    {
      "id": "1",
      "name": "Ahmed Ben Salem",
      "email": "agent@bankify.tn",
      "password": "agent123",
      "role": "agent",
      "phone": "+216 98 765 432",
      "address": "Tunis, Tunisia",
      "balance": 0,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "2",
      "name": "Fatima Mansour",
      "email": "client@bankify.tn",
      "password": "client123",
      "role": "client",
      "phone": "+216 22 123 456",
      "address": "Sfax, Tunisia",
      "balance": 15750.500,
      "createdAt": "2024-01-15T00:00:00.000Z"
    },
    {
      "id": "3",
      "name": "Mohamed Trabelsi",
      "email": "admin@bankify.tn",
      "password": "admin123",
      "role": "admin",
      "phone": "+216 55 987 654",
      "address": "Sousse, Tunisia",
      "balance": 0,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "transactions": [
    {
      "id": "tx1",
      "userId": "2",
      "amount": 500.000,
      "type": "deposit",
      "description": "Salary deposit",
      "date": "2024-12-10",
      "status": "completed",
      "from": null,
      "to": "client@bankify.tn",
      "createdAt": "2024-12-10T10:00:00.000Z"
    },
    {
      "id": "tx2",
      "userId": "2",
      "amount": 150.500,
      "type": "withdrawal",
      "description": "ATM withdrawal",
      "date": "2024-12-09",
      "status": "completed",
      "from": "client@bankify.tn",
      "to": null,
      "createdAt": "2024-12-09T14:30:00.000Z"
    },
    {
      "id": "tx3",
      "userId": "2",
      "amount": 75.250,
      "type": "transfer",
      "description": "Utility payment",
      "date": "2024-12-08",
      "status": "completed",
      "from": "client@bankify.tn",
      "to": "STEG",
      "createdAt": "2024-12-08T09:15:00.000Z"
    },
    {
      "id": "tx4",
      "userId": "2",
      "amount": 1200.000,
      "type": "deposit",
      "description": "Freelance payment",
      "date": "2024-12-05",
      "status": "completed",
      "from": null,
      "to": "client@bankify.tn",
      "createdAt": "2024-12-05T16:45:00.000Z"
    },
    {
      "id": "tx5",
      "userId": "2",
      "amount": 300.000,
      "type": "withdrawal",
      "description": "Shopping",
      "date": "2024-12-03",
      "status": "completed",
      "from": "client@bankify.tn",
      "to": null,
      "createdAt": "2024-12-03T11:20:00.000Z"
    }
  ],
  "budgets": [
    {
      "id": "b1",
      "userId": "2",
      "name": "Groceries",
      "amount": 800.000,
      "spent": 450.500,
      "category": "Food",
      "period": "monthly",
      "createdAt": "2024-11-01T00:00:00.000Z"
    },
    {
      "id": "b2",
      "userId": "2",
      "name": "Transportation",
      "amount": 300.000,
      "spent": 180.000,
      "category": "Transport",
      "period": "monthly",
      "createdAt": "2024-11-01T00:00:00.000Z"
    },
    {
      "id": "b3",
      "userId": "2",
      "name": "Entertainment",
      "amount": 200.000,
      "spent": 125.750,
      "category": "Leisure",
      "period": "monthly",
      "createdAt": "2024-11-01T00:00:00.000Z"
    },
    {
      "id": "b4",
      "userId": "2",
      "name": "Utilities",
      "amount": 400.000,
      "spent": 350.000,
      "category": "Bills",
      "period": "monthly",
      "createdAt": "2024-11-01T00:00:00.000Z"
    }
  ],
  "goals": [
    {
      "id": "g1",
      "userId": "2",
      "name": "Emergency Fund",
      "targetAmount": 10000.000,
      "currentAmount": 6500.000,
      "deadline": "2025-06-30",
      "category": "Savings",
      "createdAt": "2024-10-01T00:00:00.000Z"
    },
    {
      "id": "g2",
      "userId": "2",
      "name": "New Car",
      "targetAmount": 25000.000,
      "currentAmount": 8750.000,
      "deadline": "2025-12-31",
      "category": "Purchase",
      "createdAt": "2024-09-15T00:00:00.000Z"
    },
    {
      "id": "g3",
      "userId": "2",
      "name": "Vacation",
      "targetAmount": 5000.000,
      "currentAmount": 3200.000,
      "deadline": "2025-08-15",
      "category": "Travel",
      "createdAt": "2024-11-20T00:00:00.000Z"
    }
  ],
  "loans": [
    {
      "id": "l1",
      "userId": "2",
      "amount": 15000.000,
      "purpose": "Small Business",
      "status": "approved",
      "applicationDate": "2024-11-15",
      "interestRate": 7.5,
      "term": 36,
      "createdAt": "2024-11-15T00:00:00.000Z"
    },
    {
      "id": "l2",
      "userId": "2",
      "amount": 8000.000,
      "purpose": "Home Improvement",
      "status": "pending",
      "applicationDate": "2024-12-01",
      "interestRate": 6.8,
      "term": 24,
      "createdAt": "2024-12-01T00:00:00.000Z"
    }
  ],
  "commissions": [
    {
      "id": "c1",
      "agentId": "1",
      "month": "Jan",
      "amount": 450.000,
      "year": 2024
    },
    {
      "id": "c2",
      "agentId": "1",
      "month": "Feb",
      "amount": 520.000,
      "year": 2024
    },
    {
      "id": "c3",
      "agentId": "1",
      "month": "Mar",
      "amount": 680.000,
      "year": 2024
    },
    {
      "id": "c4",
      "agentId": "1",
      "month": "Apr",
      "amount": 590.000,
      "year": 2024
    },
    {
      "id": "c5",
      "agentId": "1",
      "month": "May",
      "amount": 720.000,
      "year": 2024
    },
    {
      "id": "c6",
      "agentId": "1",
      "month": "Jun",
      "amount": 850.000,
      "year": 2024
    },
    {
      "id": "c7",
      "agentId": "1",
      "month": "Jul",
      "amount": 920.000,
      "year": 2024
    },
    {
      "id": "c8",
      "agentId": "1",
      "month": "Aug",
      "amount": 780.000,
      "year": 2024
    },
    {
      "id": "c9",
      "agentId": "1",
      "month": "Sep",
      "amount": 890.000,
      "year": 2024
    },
    {
      "id": "c10",
      "agentId": "1",
      "month": "Oct",
      "amount": 950.000,
      "year": 2024
    },
    {
      "id": "c11",
      "agentId": "1",
      "month": "Nov",
      "amount": 1100.000,
      "year": 2024
    },
    {
      "id": "c12",
      "agentId": "1",
      "month": "Dec",
      "amount": 1250.000,
      "year": 2024
    }
  ]
}


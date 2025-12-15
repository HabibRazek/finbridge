/**
 * User storage utility for managing registered clients
 * Now uses the centralized JSON storage system
 */

import { createUser, getUserByEmail, verifyCredentials, type User } from "./json-storage"

export interface ClientRegistrationData {
  name: string
  email: string
  password: string
  phone: string
  address: string
  dateOfBirth: string
  gender?: string
  occupation?: string
}

export interface StoredClient extends User {
  role: "client"
}

/**
 * Get all registered clients
 */
export function getRegisteredClients(): StoredClient[] {
  const { getAllUsers } = require("./json-storage")
  return getAllUsers().filter((u: User) => u.role === "client") as StoredClient[]
}

/**
 * Register a new client
 */
export function registerClient(data: ClientRegistrationData): StoredClient {
  // Check if email already exists
  const existingUser = getUserByEmail(data.email)
  if (existingUser) {
    throw new Error("Email already registered")
  }
  
  const newClient = createUser({
    name: data.name,
    email: data.email,
    password: data.password,
    role: "client",
    phone: data.phone,
    address: data.address,
    dateOfBirth: data.dateOfBirth,
    gender: data.gender,
    occupation: data.occupation,
    balance: 0
  })
  
  return newClient as StoredClient
}

/**
 * Find a client by email
 */
export function findClientByEmail(email: string): StoredClient | undefined {
  const user = getUserByEmail(email)
  if (user && user.role === "client") {
    return user as StoredClient
  }
  return undefined
}

/**
 * Verify client credentials
 */
export function verifyClientCredentials(email: string, password: string): StoredClient | null {
  const user = verifyCredentials(email, password)
  if (user && user.role === "client") {
    return user as StoredClient
  }
  return null
}


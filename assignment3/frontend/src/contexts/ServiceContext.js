import React, { createContext, useMemo } from 'react'
import UserService from '../service/UserService'

export const ServiceContext = createContext()

export const ServiceProvider = ({ children }) => {
    const service = useMemo(() => {
        return {
            user: new UserService(),
        }
    }, [])

    return (
        <ServiceContext.Provider value={service}>
            {children}
        </ServiceContext.Provider>
    )
}
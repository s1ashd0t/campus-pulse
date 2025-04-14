import React from 'react'
import CreateEvent from './components/CreateEvent'
import EventList from './components/EventList'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../firebase'
import './Admin.css'
import QRCodeGenerator from './components/QRCodeGenerator'

const Admin = () => {
    const [users, setUsers] = useState([])
    const navigate = useNavigate()

    return (
        <div className='admin'>
            <h1>Admin Panel</h1>
            <div className="users">
                
                <QRCodeGenerator />
                <CreateEvent />
                <EventList />

            </div>
        </div>
    )
}
export default Admin
import { useEffect, useState } from "react"
import { getEmployeesService, getAllEmployeesService } from "../services/employee.service"

const useEmployees = (all = false) => {
    const [employees, setEmployees] = useState([])
    const [errorMsg, setErrorMsg] = useState(null)

    useEffect(() => {
        const fetch = async () => {
            try {
                const result = all ? await getAllEmployeesService() : await getEmployeesService()
                setEmployees(result)
                setErrorMsg(null)
            } catch (error) {
                setErrorMsg(error)
                console.error(error)
            }
        }
        fetch()
    }, [])

    const refreshEmployees = async () => {
        try {
            const result = all ? await getAllEmployeesService() : await getEmployeesService()
            setEmployees(result)
            setErrorMsg(null)
        } catch (error) {
            setErrorMsg(error)
            console.error(error)
        }
    }

    return { employees, errorMsg, refreshEmployees }
}

export default useEmployees
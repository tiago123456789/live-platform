import { useEffect, useState } from "react"
import Header from "../components/Header"
import { create, getAll, remove } from "../services/BotCommand";
import { get, getValueByKey } from "../services/Token";


export default () => {
    const userId = getValueByKey("userId", get());
    const [command, setCommand] = useState({
        command: "",
        reply: ""
    })

    const [commands, setCommands] = useState([]);

    const handleInputValue = (key, value) => {
        return setCommand({...command, [key]: value })
    }

    const removeItem = async (index, command) => {
        const registers = commands.filter((item, indice) => indice != index);
        await remove(userId, command)
        setCommands([...registers])
    };

    const addNewCommand = async (event) => {
        event.preventDefault();
        await create(userId, command)
        setCommand({
            command: "",
            reply: ""
        })
        loadBotCommands()
    }

    const loadBotCommands = async () => {
        const botCommands = await getAll(userId)
        setCommands(botCommands)
    }

    useEffect(() => {
        loadBotCommands();
    }, [])

    return (
        <>
            <Header />
            <section className="container-fluid">
                <h3>New bot command</h3>
                <form className="col-md-8">
                    <div className="from-group">
                        <label>Command:</label>
                        <input
                        value={command.command}
                        onChange={(event) => handleInputValue("command", event.target.value)}
                        className="form-control" placeholder="type any text after ! . Ex: !command" />
                    </div>
                    <div className="from-group">
                        <label>Response:</label>
                        <input 
                        value={command.reply}
                        onChange={(event) => handleInputValue("reply", event.target.value)}
                        className="form-control" placeholder="Text returned when user typed command" />
                    </div>
                    <div className="from-group mt-1">
                        <button 
                        onClick={addNewCommand}
                        className="btn btn-primary">Create</button>
                    </div>
                </form>
                <h3>Bot commands</h3>
                <div className="col-md-8 mt-2">
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>Command</th>
                                <th>Response</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                commands.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{item.command}</td>
                                            <td>{item.reply}</td>
                                            <td>
                                                <button className="btn btn-danger" onClick={() => removeItem(index, item.command)}>Remove</button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }

                        </tbody>
                    </table>

                </div>
            </section>
        </>
    )
}
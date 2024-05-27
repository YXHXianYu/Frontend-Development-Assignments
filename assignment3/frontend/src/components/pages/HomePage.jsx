import React from "react"

const HomePage = () => {

    const pixelArt = [
        "MMMMMMMM               MMMMMMMM IIIIIIIII    SSSSSSSSSSSSSSS",
        "M:::::::M             M:::::::M I::::::::I  SS:::::::::::::::S",
        "M::::::::M           M::::::::M I::::::::I S:::::SSSSSS::::::S",
        "M:::::::::M         M:::::::::M II::::::II S:::::S     SSSSSSS",
        "M::::::::::M       M::::::::::M   I::::I   S:::::S            ",
        "M:::::::::::M     M:::::::::::M   I::::I   S:::::S            ",
        "M:::::::M::::M   M::::M:::::::M   I::::I    S::::SSSS         ",
        "M::::::M M::::M M::::M M::::::M   I::::I     SS::::::SSSSS    ",
        "M::::::M  M::::M::::M  M::::::M   I::::I       SSS::::::::SS  ",
        "M::::::M   M:::::::M   M::::::M   I::::I          SSSSSS::::S ",
        "M::::::M    M:::::M    M::::::M   I::::I               S:::::S",
        "M::::::M     MMMMM     M::::::M   I::::I               S:::::S",
        "M::::::M               M::::::M II::::::II SSSSSSS     S:::::S",
        "M::::::M               M::::::M I::::::::I S::::::SSSSSS:::::S",
        "M::::::M               M::::::M I::::::::I S:::::::::::::::SS ",
        "MMMMMMMM               MMMMMMMM IIIIIIIII  SSSSSSSSSSSSSSS   ",
    ]

    const style = {
        fontFamily: '"JetBrains Mono"',
    }

    return (
        <div>
            <h1>React Management Information System</h1>
            <pre style={style}>
                {pixelArt.map((line, index) => {
                    return <div key={index} style={style}>{line}</div>
                })}
            </pre>
        </div>
    )
}

export default HomePage

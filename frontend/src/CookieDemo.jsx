import Cookies from 'js-cookie'

function CookieDemo(){
    Cookies.set("data",JSON.stringify({name:"goodwin",token:"jwhduwhf98484jfiejfiojdef8urgjrogur9"}),{expires:1})
    const storedData = Cookies.get("data")
    console.log(storedData);
    const parsedData = JSON.parse(storedData)
    console.log(parsedData);

    return(
        <div>
            <h1>{parsedData.name}</h1>
        </div>
    )
}

export default CookieDemo;
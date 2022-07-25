import Header from "../components/Header"

export default () => {

    return (
        <>
            <Header />
            <div className="container mt-2">
                <div className="row">
                    <div className="col-md-4 offset-md-5">
                        <a 
                            href={`https://github.com/login/oauth/authorize?client_id=${process.env.REACT_APP_OAUTH_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_OAUTH_REDIRECT_URI}&scope=user`}
                            className="btn btn-primary">
                                Login Github
                            </a>
                    </div>
                </div>
            </div>
        </>
    )
}
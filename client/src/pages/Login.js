import Header from "../components/Header"

export default () => {

    return (
        <>
            <Header />
            <div className="container mt-2">
                <div className="row">
                    <div className="col-md-4 offset-md-5">
                        <a 
                            href="https://github.com/login/oauth/authorize?client_id=78f0a43389bb2701344d&redirect_uri=http://localhost:3000/oauth-callback&scope=user"
                            className="btn btn-primary">
                                Login Github
                            </a>
                    </div>
                </div>
            </div>
        </>
    )
}
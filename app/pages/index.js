import Link from 'next/link'

export default function Home() {
    return (
        <>

            <div className="container" style={{ marginTop: 5 + 'em' }}>
                <main role="main" className="pb-3">
                </main>
            </div>

            <div className="row">
                <div className=" col-sm-12 col-md-6 col-xl-4 ml-3">
                    <div className="card text-bg-light shadow-lg p-3 mb-5 bg-white rounded" style={{ maxwidth: 18 + 'rem' }}>
                        <div className="card-header bg-light">L'EREDITA'</div>
                        <div className="card-body">
                            
                            <Link href="twitter"><button type="button" className="btn btn-outline-primary"> clicca qui</button></Link>

                        </div>
                    </div>
                </div>





                
                    <div className="col-sm-12 col-md-6 col-xl-4 ml-3">
                        <div className="card text-bg-light  shadow-lg p-3 mb-5 bg-white rounded" style={{ maxwidth: 18 + 'rem' }}>
                            <div className="card-header bg-light">SCACCHI</div>
                            <div className="card-body">
                                <Link href="chess"><button type="button" className="btn btn-outline-primary"> clicca qui</button></Link>
                            </div>
                        </div>
                    </div>


                    <div className="col-sm-12 col-md-6 col-xl-4 ml-3">
                        <div className="card text-bg-light shadow-lg p-3 mb-5 bg-white rounded" style={{ maxwidth: 18 + 'rem' }}>
                            <div className="card-header bg-light">FANTACITORIO</div>
                            <div className="card-body">
                            <Link href="fantacitorio"><button type="button" className="btn btn-outline-primary"> clicca qui</button></Link>
                            </div>
                        </div>
                    </div>
                </div>

            </>




            )
}

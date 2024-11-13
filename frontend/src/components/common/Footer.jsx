import './Footer.scss';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className='footer-content-text'>
                    <p className="footer-text">
                        <span className='simbolo'>©&nbsp;</span>
                        <a href="https://amadeus.com" target="_blank" rel="noopener noreferrer">Amadeus</a>
                        &nbsp;&nbsp;{new Date().getFullYear()}
                    </p>
                </div>
                <button className="footer-button" type="button">
                    Avisos legales
                </button>
            </div>
        </footer>
    );
}

export default Footer;

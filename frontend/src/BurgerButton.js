function BurgerButton({onClick}){
    return(
        <div id="burgerBtn" onClick={onClick}>
            <div className="burgerLine"></div>
            <div className="burgerLine"></div>
            <div className="burgerLine"></div>
        </div>
    );
}
export default BurgerButton;

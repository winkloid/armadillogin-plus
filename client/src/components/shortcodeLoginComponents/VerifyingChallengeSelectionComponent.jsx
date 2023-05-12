export default function VerifyingChallengeSelectionComponent({sessionInformation, currentlySelectedChallengeResponse, setCurrentlySelectedChallengeResponse}) {
    const radioButtonList = sessionInformation.verifyingChallenges.map((challengeResponse, challengeResponseIndex) =>
        <div className={(challengeResponse === currentlySelectedChallengeResponse) ? "alert alert-primary mx-1" : "alert alert-secondary mx-1"} onClick={() => setCurrentlySelectedChallengeResponse(challengeResponse)}>
            <div className="form-check">
                <input className="form-check-input" type="radio" checked={challengeResponse === currentlySelectedChallengeResponse} name="challengeOptions" id={"challengeOption" + challengeResponseIndex}/>
                <div className={"text-center"}>
                    <label className="form-check-label display-6" htmlFor={"challengeOption" + challengeResponseIndex}>
                        {challengeResponse}
                    </label>
                </div>
            </div>
        </div>
);
    return(
        <form>{radioButtonList}</form>
    );
}
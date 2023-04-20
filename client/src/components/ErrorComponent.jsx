import {ErrorState} from "../types/errorState.js";
export default function ErrorComponent({ errorState, errorMessage }) {
    return(
        <>{!(errorState === ErrorState.success) && (
            <div>
                <p>{errorMessage}</p>
            </div>)}
        </>
    );
}
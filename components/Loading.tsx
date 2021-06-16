import {Circle} from "better-react-spinkit"

export interface LoadingProps {}

const Loading: React.FC<LoadingProps> = () => {
    return (
        <div style={{display: "grid", placeItems: "center", height: "100vh"}} >
            <div>
                <img
                    src="https://assets.stickpng.com/images/580b57fcd9996e24bc43c543.png"
                    alt=""
                    height={200}
                    style={{marginBottom: 10}}
                />

                <Circle color="#3CBC28" size={60} />
            </div>
        </div>
    );
};

export default Loading;

import { getClientsTransport } from "../../actions";

interface Props {
    e: React.ChangeEvent<HTMLInputElement>;
}

export const useClientsTransport = ({e}: Props) => {
    const data = getClientsTransport({e});

    return {
        data
    };
};
import { getClients } from "../../actions";

interface Props {
	e: React.ChangeEvent<HTMLInputElement>;
}

export const useClients = ({e}: Props) => {
	const data = getClients({e});

	return {
		data
	};
};
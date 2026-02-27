declare module "react-search-input" {
  export function createFilter(
    value: string,
    keys: string[]
  ): (candidate: unknown) => boolean;

  const SearchInput: (props: {
    className?: string;
    onChange: (value: string) => void;
    placeholder?: string;
  }) => JSX.Element;

  export default SearchInput;
}

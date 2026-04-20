import Select from 'react-select';

const colourStyles = {
  container: (styles: any) => ({ ...styles, width: '100%' }),
  menu: (styles: any) => ({ ...styles, zIndex: 5, backgroundColor: '#222', border: '1px solid #444' }),
  placeholder: (styles: any) => ({ ...styles, fontSize: 14, color: '#737373' }),
  menuList: (styles: any) => ({ ...styles, maxHeight: 248, overflowY: 'auto' }),
  multiValue: (styles: any) => ({ ...styles, backgroundColor: '#464B65', borderRadius: 4 }),
  multiValueLabel: (styles: any) => ({ ...styles, color: 'white' }),
  multiValueRemove: (styles: any) => ({
    ...styles,
    color: 'white',
    ':hover': { backgroundColor: '#5A5F7A', color: 'red' },
  }),
};

interface ISelect<T> {
  value: T | null;
  onChange: (val: T | null) => void;
  options: T[];
  disabled?: boolean;
  labelKey?: string;
}

export const SelectDefault = <T,>({ value, onChange, options, disabled = false, labelKey = 'type' }: ISelect<T>) => {
  const selectStyles = {
    ...colourStyles,
    control: (styles: any) => ({
      ...styles,
      backgroundColor: '#121212',
      border: '1px solid #4d4d4d',
      borderRadius: 4,
      height: 44,
      minHeight: 40,
      boxShadow: 'none',
      ':hover': { border: '1px solid #4d4d4d' },
    }),
    singleValue: (styles: any) => {
      return {
        ...styles,
        color: disabled ? "#2f2f2f" : "white",
        fontSize: 14,
      };
    },
    dropdownIndicator: (styles: any) => ({
      ...styles,
      color: disabled ? '#2f2f2f' : 'white',
      cursor: disabled ? 'not-allowed' : 'pointer',
      ':hover': { color: disabled ? '#2f2f2f' : 'white' },
    }),
    indicatorSeparator: (styles: any) => ({ ...styles, backgroundColor: disabled ? '#2f2f2f' : 'white' }),
    option: (
      styles: any,
      { isDisabled, isSelected, data }: { isDisabled: boolean; isSelected: boolean, data: any }
    ) => {
      const label = data?.label;

      return {
        ...styles,
        backgroundColor: isSelected ? '#333' : '#111',
        color: 'white',
        borderBottom: label === 'kiosk' ? "1px solid #777" : "none",
        cursor: isDisabled ? 'not-allowed' : 'default',
        ':active': { ...styles[':active'], backgroundColor: 'green' },
      }
    },
  };


  return (
    <Select
      isDisabled={disabled}
      menuPosition="fixed"
      options={options}
      onChange={(v) => onChange(v)}
      value={value}
      styles={selectStyles}
      isClearable
      isSearchable={false}
      isMulti={false}
      getOptionLabel={(option: any) => option[labelKey]}
      getOptionValue={(option: any) => option.value.toString()}
    />
  );
};
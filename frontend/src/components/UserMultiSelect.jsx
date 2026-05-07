import { Autocomplete, Chip, TextField } from '@mui/material';

const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

export default function UserMultiSelect({
  users = [],
  value = [],
  onChange,
  label = 'Users',
  placeholder = 'Search users',
  disabled = false
}) {
  const selectedIds = new Set(toArray(value));
  const selectedUsers = users.filter((user) => selectedIds.has(user._id));

  return (
    <Autocomplete
      multiple
      disableCloseOnSelect
      filterSelectedOptions
      options={users}
      value={selectedUsers}
      disabled={disabled}
      getOptionLabel={(option) => option.name || option.email || ''}
      isOptionEqualToValue={(option, selected) => option._id === selected._id}
      onChange={(_, selected) => onChange(selected.map((user) => user._id))}
      renderTags={(selected, getTagProps) =>
        selected.map((option, index) => (
          <Chip
            label={option.name}
            size="small"
            {...getTagProps({ index })}
            key={option._id}
          />
        ))
      }
      renderOption={(props, option) => (
        <li {...props} key={option._id}>
          <div>
            <p className="text-sm font-bold text-slate-700">{option.name}</p>
            <p className="text-xs text-slate-400">{option.email} - {option.role}</p>
          </div>
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          size="small"
        />
      )}
    />
  );
}

import cx from 'classnames';

interface ToggleButtonProps {
  isActive: boolean;
  onClick: () => void;
  label: string;
}

export default function ToggleButton(props: ToggleButtonProps) {
  return (
    <button
      type="button"
      className={cx('px-4 py-2 bg-gray-700 text-white rounded-md', {
        'border-2 border-blue-500': props.isActive,
      })}
      onClick={props.onClick}
    >
      {props.label}
    </button>
  );
}

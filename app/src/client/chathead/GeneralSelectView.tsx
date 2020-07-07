import React from "react";

interface SelectViewProps {
  options: any[];
  optionsLoading: boolean;
  optionId?: string;
  onChange: (optionId: string) => void;
}

export class SelectView extends React.Component<SelectViewProps, {}> {
  onChange(optionId) {
    this.props.onChange(optionId);
  }

  render() {
    const { options, optionId, optionsLoading } = this.props;
    return (
      <div>
        {optionsLoading === true && <LoadingView />}
        {optionsLoading === false && (
          <OptionSelect
            {...{
              optionId,
              options,
              onChange: (optionId) => this.onChange(optionId),
            }}
          />
        )}
      </div>
    );
  }
}

export const LoadingView = () => <div>Loading...</div>;
export const OptionSelect = ({ options, optionId, onChange }) => {
  return (
    <select value={optionId} onChange={(e) => onChange(e.target.value)}>
      {options.map((option) => (
        <Option key={option} option={option} />
      ))}
    </select>
  );
};

export const Option = ({ option }) => <option value={option}>{option}</option>;

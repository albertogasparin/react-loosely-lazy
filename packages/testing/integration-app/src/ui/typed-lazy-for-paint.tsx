import React from 'react';

export type TypedLazyForPaintProps = {
  id: string;
};

export const TypedLazyForPaint = ({ id }: TypedLazyForPaintProps) => (
  <div>Typed lazy for paint: {id}</div>
);

export default TypedLazyForPaint;

const Popularity = ({ num, width, height }) => {
    // Calculate cx and cy based on the center of the SVG
    const cx = width / 2;
    const cy = height / 2;

    // Calculate r based on half of the minimum of width and height
    const r = Math.min(cx, cy) * 0.8;

    // Calculate fontSize based on the size of the SVG
    const fontSize = Math.min(width, height) * 0.25; // Adjust as needed

    // Calculate the strokeDasharray based on the size of the SVG
    const circumference = 2 * Math.PI * r;
    const strokeDasharray2 = `calc((${num}) * ${circumference / 100}) ${circumference}`;

    return (
        <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} xmlns="http://www.w3.org/2000/svg">
            {/* Draw the red part of the circle */}
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="red"
                strokeWidth={r * 0.16} // Adjusted for the larger circle
            />

            {/* Draw the green part of the circle */}
            <circle
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke="green"
                strokeWidth={r * 0.16} // Adjusted for the larger circle
                strokeDasharray={strokeDasharray2}
                transform={`rotate(-90 ${cx} ${cy})`}
            />

            {/* Display the number in the middle of the circle */}
            <text x={cx} y={cy + fontSize / 3} fontSize={fontSize} textAnchor="middle" fill="currentColor">
                {num}
            </text>
        </svg>
    );
};

export default Popularity;

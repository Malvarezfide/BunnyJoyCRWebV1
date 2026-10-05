function OpeningHours({ hours, theme }) {
  return (
    <section>
      <div
        className="
          mx-4
          sm:mx-auto
          mt-12
          max-w-lg
          rounded-3xl
          bg-white
          shadow-md
          border
          border-gray-100
          overflow-hidden
        "
      >

        {/* Línea de color de temporada */}

        <div
          className={`
            h-1
            ${theme.accent}
          `}
        />

        <div className="p-6">

          <h2
            className="
              text-xl
              font-semibold
              text-gray-800
              text-center
              mb-5
            "
          >
            🕒 Horarios de atención
          </h2>

          <div className="space-y-3">

            {hours.map((item) => (

              <div
                key={item.day}
                className="
                  flex
                  justify-between
                  items-center
                  border-b
                  border-gray-100
                  last:border-0
                  pb-3
                "
              >

                <span className="text-gray-600">
                  {item.day}
                </span>

                <span
                  className={`
                    font-semibold
                    ${
                      item.time === "Cerrado"
                        ? theme.closedText
                        : "text-gray-800"
                    }
                  `}
                >
                  {item.time}
                </span>

              </div>

            ))}

          </div>

        </div>

      </div>
    </section>
  );
}

export default OpeningHours;

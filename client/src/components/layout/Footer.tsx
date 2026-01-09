export default function Footer() {
  return (
    <footer className="border-t bg-primary py-6 md:py-0 text-white ">
      <div className="px-20 flex flex-col items-center justify-between gap-4 md:h-12 md:flex-row ">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose md:text-left ">
            Built by{" "}
            <a
              href="#"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Aetd. {"   "}
            </a>
              All rights reserved.
          </p>
        </div>
        
        {/* Link phụ ở footer */}
        <div className="flex gap-4 text-sm">
          Hỗ trợ: <a href="mailto:hanflorist.shop@gmail.com">hanflorist.shop@gmail.com</a>
        </div>
      </div>
    </footer>
  )
}
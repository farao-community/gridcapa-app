FROM httpd:2.4.59@sha256:10182d88d7fbc5161ae0f6f758cba7adc56d4aae2dc950e51d72c0cf68967cea

RUN echo "Include conf/app-httpd.conf" >> /usr/local/apache2/conf/httpd.conf
COPY app-httpd.conf /usr/local/apache2/conf/
COPY build /usr/local/apache2/htdocs/gridcapa
RUN sed -i -e 's;<base href="/" />;<base href="<!--#echo var="BASE" -->" />;' /usr/local/apache2/htdocs/gridcapa/index.html

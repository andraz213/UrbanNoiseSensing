import math
from collections import defaultdict

import Orange
import numpy as np
from AnyQt.QtCore import Qt, QSize
from IPython.core.display import Math
from PyQt5.QtWidgets import QListWidgetItem, QGridLayout
from orangewidget.utils.widgetpreview import WidgetPreview
from datetime import *

from orangewidget.widget import Msg
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis
import requests
import json
from Orange.data import Table, Domain, StringVariable, ContinuousVariable, DiscreteVariable, TimeVariable
from Orange.preprocess import Impute, Continuize
from Orange.widgets import gui, settings
from Orange.widgets.widget import OWWidget, Default, Output

from AnyQt.QtGui import QIntValidator

class UNSdata(OWWidget):
    name = "UNSdata"
    description = "UNS data collection."
    icon = "icons/XXX.svg"

    class Outputs:
        data = Output("Data", Orange.data.Table)

    class Error(OWWidget.Error):
        error = Msg("Coulld not get data!")

    class Information(OWWidget.Information):
        getting_data = Msg("Getting data")
        done = Msg("Done")




    BASE_URL = 'https://urbannoisesensing.herokuapp.com/api/'

    number = settings.Setting(42)
    want_main_area = True
    resizing_enabled = True
    selected = []
    n_attributes = 0
    last_measurements = 100
    n_intervals = 10
    interval_len = 30
    query_type = 0
    output_type = 0

    last_seconds = 100

    query_controls = False

    lb_labels = []


    MAX_N_ATTRS = 13

    display_index = []

    def __init__(self):
        super().__init__(self)

        gui.rubber(self.controlArea)

        box = gui.vBox(self.mainArea, "Configure data query")

        self.radiobox = gui.radioButtons(box, self, "query_type", callback=self.radio_changed)

        gui.appendRadioButton(self.radiobox, "All data")
        gui.appendRadioButton(self.radiobox, "Interesting intervals")

        ibox = gui.indentedBox(self.radiobox)

        gui.spin(
            ibox, self, "interval_len", 1, 100000, label="Interval length",
            controlWidth=60, callback=self.number_changed)

        gui.spin(
            ibox, self, "n_intervals", 1, 100000, label="Number of intervals",
            controlWidth=60, callback=self.number_changed)

        gui.appendRadioButton(self.radiobox, "Custom intervals")

        gui.appendRadioButton(self.radiobox, "Last n seconds")

        nbox = gui.indentedBox(self.radiobox)

        gui.spin(
            nbox, self, "last_seconds", 1, 10000000, label="Last seconds",
            controlWidth=60, callback=self.number_changed)

        gui.appendRadioButton(self.radiobox, "Last n measurements on each sensor")

        nmbox = gui.indentedBox(self.radiobox)

        gui.spin(
            nmbox, self, "last_measurements", 1, 10000000, label="Last measurements",
            controlWidth=60, callback=self.number_changed)

        self.radiobox.setDisabled(not self.query_controls)


        self.objects = {}
        self.lb_objects = gui.listBox(self.controlArea, self, "selected", "lb_labels", box="Deployments",
                                    callback=self.sel_changed,
                                      sizeHint=QSize(300, 300))
        self.lb_objects.setFocusPolicy(Qt.NoFocus)

        out_box = gui.vBox(self.mainArea, "Output")

        self.out_box = gui.radioButtons(out_box, self, "output_type", callback=self.radio_changed)

        gui.appendRadioButton(self.out_box, "Matrix")
        gui.appendRadioButton(self.out_box, "Tensor")

        self.apply_button = gui.button(self.mainArea, self, self.tr("&Apply"),
                                       callback=self.apply)

        self.out_box.setDisabled(not self.query_controls)

        self.get_deployments()



    def get_deployments(self):
        url = self.BASE_URL + 'deployment'
        response = requests.get(url, headers={'content-type': 'application/json', 'accept': 'application/json'})
        if response.status_code == 200:
            deployments = response.json()

            for dep in deployments:
                jsn_data = dep
                item = QListWidgetItem(dep["name"])
                item.setData(Qt.UserRole, jsn_data)
                self.lb_objects.addItem(item)


    def radio_changed(self):
        print(self.query_type)


    def apply(self):
        if self.lb_objects.count() != 0:
            self.Information.getting_data()
            selected_deployment = self.lb_objects.currentItem().data(Qt.UserRole)
            dep_id = selected_deployment["_id"]
            url = self.BASE_URL

            if self.query_type == 0:
                url += 'data/deployment/'
                url += str(dep_id)

            if self.query_type == 1:
                url += 'data/deployment/interesting/'
                url += str(dep_id)
                url += '/'
                url += str(self.interval_len)
                url += '/'
                url += str(self.n_intervals)

            if self.query_type == 2:
                print("yeet")

            if self.query_type == 3:
                url += 'data/deployment/'
                url += str(dep_id)
                url += '/seconds/'
                url += str(self.last_seconds)

            if self.query_type == 4:
                url += 'data/deployment/'
                url += str(dep_id)
                url += '/'
                url += str(self.last_measurements)




            response = requests.get(url, headers={'content-type': 'application/json', 'accept': 'application/json'})
            if response.status_code != 200:
                self.Error.error()
                return

            if response.status_code == 200:

                recieved_data = response.json()
                transformed_data = []

                if self.output_type == 0:
                    transformed_data = self.create_matrix(recieved_data)

                if self.output_type == 1:
                    transformed_data = self.create_tensor(recieved_data)

                self.Information.done()
                self.Outputs.data.send(transformed_data)







                #output = Orange.data.Table.from_list()


    def create_tensor(self, json_data):
        recieved_data = json_data
        print(recieved_data)
        decibels = []
        long = []
        lat = []
        timestamp = []
        ids = []
        date_time = []
        fft_data = []
        frequens = []

        for id, sensor in enumerate(recieved_data):
            for dd in sensor["data"]:
                decibels.append(dd["decibels"])
                ids.append(id)

                lat.append(sensor["location"][0])
                long.append(sensor["location"][1])
                timestr = str(dd["measured_at"])
                timestr = timestr.replace("T", " ")
                timestr = timestr.replace("Z", "")

                time = datetime.strptime(timestr, '%Y-%m-%d %H:%M:%S.%f')

                timestamp.append(time.timestamp())
                date_time.append(str(time))
                fft_data.append(dd["fftValues"])

                frekvence = [math.floor(((i + 0.5) / len(dd["fftValues"])) * dd["frequencyRange"]) for i in
                             range(len(dd["fftValues"]))]
                frequens = frekvence

        time_var = TimeVariable()
        to_zip_td = [time_var.parse(i) for i in date_time]

        con_domena = [ContinuousVariable("decibels"), ContinuousVariable("sensor_id"), ContinuousVariable("longitude"),
                      ContinuousVariable("lattitude"), ContinuousVariable("timestamp")]
        for ff in frequens:
            con_domena.append(ContinuousVariable(str(ff)))

        fft_data = list(map(list, zip(*fft_data)))

        transformed_data = Table.from_list(
            Domain(con_domena,
                   [TimeVariable('datetime')]),
            list(zip(decibels, ids, long, lat, timestamp, *fft_data, to_zip_td))
        )

        return transformed_data



    def create_matrix(self, json_data):
        recieved_data = json_data
        print(recieved_data)
        n_sensors = len(recieved_data)

        final_data = [defaultdict(int) for i in range(n_sensors)]

        for id, sensor in enumerate(recieved_data):
            for dd in sensor["data"]:
                timestr = str(dd["measured_at"])
                timestr = timestr.replace("T", " ")
                timestr = timestr.replace("Z", "")

                time_var = TimeVariable()
                time = time_var.parse(str(datetime.strptime(timestr, '%Y-%m-%d %H:%M:%S.%f')))

                for n, defdic in enumerate(final_data):
                    defdic[time] += 0
                    if n == id:
                        defdic[time] = dd["decibels"]


        data_matrix = []

        for key in final_data[0].keys():
            temp = []
            temp.append(key)
            for n, sens_data in enumerate(final_data):
                temp.append(sens_data[key])

            data_matrix.append(temp)

        con_domena = []

        for i in range(n_sensors):
            con_domena.append(ContinuousVariable("sensor_" + str(i)))


        transformed_data = Table.from_list( Domain([TimeVariable('datetime')], con_domena),data_matrix)

        return transformed_data


    def number_changed(self):
        print("sds")
        print(self.number)
        print(self.display_index)
        if self.lb_objects.count() == 0:
            print("bleh")
        else:
            print(self.lb_objects.currentItem())


    def sel_changed(self):
        self.query_controls = False
        self.radiobox.setDisabled(not self.query_controls)
        self.out_box.setDisabled(not self.query_controls)
        print("sds")
        print(self.number)
        if self.lb_objects.count() == 0:
            self.send("Object", None)
        else:

            jsn_data = self.lb_objects.currentItem().data(Qt.UserRole)
            url = 'https://urbannoisesensing.herokuapp.com/api/deployment/' + str(jsn_data["_id"])
            resp = requests.get(url, headers={'content-type': 'application/json', 'accept': 'application/json'})
            if resp.status_code == 200:
                self.query_controls = True
                self.radiobox.setDisabled(not self.query_controls)
                self.out_box.setDisabled(not self.query_controls)
                print(resp.json())





if __name__ == "__main__":  # pragma: no cover
    WidgetPreview(UNSdata).run()
